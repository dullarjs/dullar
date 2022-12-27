/*
 * @Author: Just be free
 * @Date:   2020-04-28 15:42:16
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-12-27 15:54:34
 * @E-mail: justbefree@126.com
 */

import YnSpin from "../spin";
import { getScrollTop } from "../modules/dom";
import { slotsMixins } from "../mixins/slots";
import { touchMixins } from "../mixins/touch";
import { preventDefault, on, off } from "../modules/event";
import { contains } from "../modules/dom/contains";
import { getScroller } from "../modules/dom/scroll";
import { defineComponent, genComponentName } from "../modules/component";

const DURATION_TIME = 300;
const statusNames = ["pulling", "loosing", "loading", "success", "initial"];

export default defineComponent({
  name: "PullRefresh",
  mixins: [slotsMixins, touchMixins],
  components: { YnSpin },
  props: {
    value: {
      type: Boolean,
    },
    dragDistance: {
      type: Number,
      default: 48,
    },
    cancelBubbles: {
      type: Array,
      default: () => {
        return [];
      },
    },
    loadingTexts: {
      type: Array,
      default: () => ["下拉刷新", "松手刷新", "正在刷新", "已刷新"],
    },
    loadingStatusText: {
      type: String,
      default: "加载中",
    },
    refreshTimeout: {
      type: Number,
      default: 60 * 1000,
    },
    refreshFailedText: {
      type: String,
      default: "刷新失败",
    },
    refreshFailed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      className: "",
      dragging: false,
      scrollElement: null,
      scrollTop: 0,
      isLoading: false,
      distance: 0,
      timer: null,
    };
  },
  computed: {
    status() {
      const statusValue = this.value;
      const pullDistance = this.dragDistance;
      if (!statusValue && this.isLoading) {
        return "success";
      }
      if (!statusValue || this.distance === 0) {
        return "initial";
      }
      if (this.distance < pullDistance) {
        return "pulling";
      }
      if (this.isLoading) {
        return "loading";
      }
      return "loosing";
    },
    isTouchable() {
      return this.status !== "loading" && this.status !== "success";
    },
    refreshStyle() {
      return {
        transitionDuration: `${DURATION_TIME}ms`,
        transform: this.distance
          ? `translate3d(0, ${this.distance}px, 0)`
          : "unset",
      };
    },
    refreshText() {
      if (this.refreshFailed) return this.refreshFailedText;
      const index = statusNames.findIndex((item) => item === this.status);
      if (index === -1) return "";
      return this.loadingTexts[index] || "";
    },
    reachTop() {
      return this.scrollTop === 0;
    },
  },
  mounted() {
    this.pull();
  },
  beforeDestroy() {
    off(this.scrollElement, "scroll", this.handleScroll);
    // this.scrollElement.removeEventListener("scroll", this.handleScroll, false);
  },
  methods: {
    getBubbleDoms() {
      return this.cancelBubbles.map((i) => document.querySelector(i));
    },
    contains(target) {
      let contain = false;
      this.getBubbleDoms().forEach((dom) => {
        if (dom && contains(dom, target)) {
          contain = true;
        }
      });
      return contain;
    },
    handleScroll(e) {
      this.scrollTop = getScrollTop(e.target);
      e.target.scrollTop = this.scrollTop < 0 ? 0 : this.scrollTop;
      this.$emit("getTop", this.scrollTop);
    },
    scroll() {
      this.scrollElement = getScroller(this.$el);
      // this.scrollElement.addEventListener("scroll", this.handleScroll, false);
      on(this.scrollElement, "scroll", this.handleScroll);
    },
    pull() {
      this.scroll();
      const that = this;
      this.bindEvent(this.$el, {
        start(event) {
          if (that.contains(event.e.target) && that.isTouchable) return;
          that.$emit("input", true);
          that.distance = 0;
        },
        dragging(event) {
          if (that.contains(event.e.target) && that.isTouchable) return;
          if (that.deltaY > 0 && that.reachTop) {
            preventDefault(event.e, true);
          }
          const ease = (distance) => {
            const pullDistance = that.dragDistance;
            if (distance > pullDistance) {
              if (distance < pullDistance * 2) {
                distance = pullDistance + (distance - pullDistance) / 2;
              } else {
                distance =
                  pullDistance * 1.5 + (distance - pullDistance * 2) / 4;
              }
            }

            return Math.round(distance);
          };
          const maxDistance = that.dragDistance * 3;
          if (that.reachTop && that.deltaY >= 0 && that.deltaY < maxDistance) {
            that.distance = ease(that.deltaY);
          }
        },
        stop(event) {
          if (
            that.reachTop &&
            that.contains(event.e.target) &&
            that.isTouchable
          )
            return;
          if (that.status === "loosing") {
            that.distance = that.dragDistance;
            that.isLoading = true;
            that.$emit("refresh");
            const timer = setTimeout(() => {
              if (that.isLoading) {
                that.$emit("timeout");
                that.$emit("input", false);
                that.distance = 0;
              }
            }, that.refreshTimeout);
            that.$once("hook:beforeDestroy", () => {
              clearTimeout(timer);
            });
          } else {
            that.$emit("input", false);
          }
        },
      });
    },
    genLoading(h) {
      return h("div", { class: "yn-pull-refresh-loading" }, [
        h(genComponentName("YnSpin"), {
          props: {
            size: 18,
            type: "rotateSvg",
          },
        }),
        this.loadingStatusText
          ? h(
              "span",
              { class: "yn-pull-refresh-loading-text" },
              this.loadingStatusText
            )
          : null,
      ]);
    },
    genDraggingText(h) {
      return h("div", { class: "yn-pull-refresh-dragging-text" }, [
        h("span", {}, this.refreshText),
      ]);
    },
    genDraggingWrapper(h) {
      return h(
        "div",
        {
          class: "yn-pull-refresh-wrapper",
          style: { height: `${this.dragDistance}px` },
          directives: [{ name: "show", value: !!this.distance }],
        },
        [
          this.status === "loading"
            ? this.genLoading(h)
            : this.genDraggingText(h),
        ]
      );
    },
  },
  watch: {
    status(newVal) {
      // 下拉刷新结束后，收起下拉页面
      if (newVal === "success" || newVal === "initial") {
        // 延时300ms收起下拉框，加强刷新成功提示
        const timer = setTimeout(() => {
          this.distance = 0;
          this.isLoading = false;
          clearTimeout(timer);
        }, 300);
      }
    },
  },
  render(h) {
    return h("div", { class: ["yn-pull-refresh"], style: this.refreshStyle }, [
      this.genDraggingWrapper(h),
      this.slots(),
    ]);
  },
});
