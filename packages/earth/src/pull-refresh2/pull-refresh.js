/*
 * @Author: Just be free
 * @Date:   2020-04-28 15:42:16
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-11-18 11:56:41
 * @E-mail: justbefree@126.com
 */

import { defineComponent, genComponentName } from "../modules/component";
import { getScrollTop } from "../modules/dom";
import { getScroller } from "../modules/dom/scroll";
import { slotsMixins } from "../mixins/slots";
import { touchMixins } from "../mixins/touch";
import { contains } from "../modules/dom/contains";
import { preventDefault } from "../modules/event";
import Spin from "../spin";

const DURATION_TIME = 300;
const statusNames = ["pulling", "loosing", "loading", "success", "initial"];
export default defineComponent({
  name: "PullRefresh2",
  mixins: [slotsMixins, touchMixins],
  components: { Spin },
  props: {
    value: {
      type: Boolean
    },
    dragDistance: {
      type: Number,
      default: 48
    },
    cancelBubbles: {
      type: Array,
      default: () => {
        return [];
      }
    },
    loadingTexts: {
      type: Array,
      default: () => ["下拉刷新", "松手刷新", "正在刷新", "已刷新"]
    },
    loadingStatusText: {
      type: String,
      default: "加载中"
    },
    refreshTimeout: {
      type: Number,
      default: 60 * 1000
    }
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
      fullyStoped: true
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
      if (this.fullyStoped) return {};
      return {
        transitionDuration: `${DURATION_TIME}ms`,
        transform: `translate3d(0, ${this.distance}px, 0)`
      };
    },
    refreshText() {
      const index = statusNames.findIndex(item => item === this.status);
      if (index === -1) return "";
      return this.loadingTexts[index] || "";
    },
    reachTop() {
      return this.scrollTop === 0;
    }
  },
  mounted() {
    this.pull();
  },
  beforeDestroy() {
    this.scrollElement.removeEventListener("scroll", this.handleScroll, false);
  },
  methods: {
    getBubbleDoms() {
      return this.cancelBubbles.map(i => document.querySelector(i));
    },
    contains(target) {
      let contain = false;
      this.getBubbleDoms().forEach(dom => {
        if (dom && contains(dom, target)) {
          contain = true;
        }
      });
      return contain;
    },
    handleScroll(e) {
      this.scrollTop = getScrollTop(e.target);
    },
    scroll() {
      this.scrollElement = getScroller(this.$el);
      this.scrollElement.addEventListener("scroll", this.handleScroll, false);
    },
    pull() {
      this.scroll();
      const that = this;
      this.bindEvent(this.$el, {
        start(event) {
          if (that.contains(event.e.target) && this.isTouchable) return;
          that.$emit("input", true);
          that.distance = 0;
          that.fullyStoped = false;
        },
        dragging(event) {
          if (that.contains(event.e.target) && this.isTouchable) return;
          if (that.deltaY > 0 && that.reachTop) {
            preventDefault(event.e, true);
          }

          const bound = (position, min, max) => {
            let ret = position;
            if (min !== undefined) {
              ret = Math.max(position, min);
            }
            if (max !== undefined) {
              ret = Math.min(ret, max);
            }
            return ret;
          };

          const rubberband = (distance, dimension, constant) => {
            return (
              (distance * dimension * constant) /
              (dimension + constant * distance)
            );
          };

          const rubberbandIfOutOfBounds = (
            position,
            min,
            max,
            dimension,
            constant = 0.15
          ) => {
            if (constant === 0) return bound(position, min, max);
            if (position < min)
              return -rubberband(min - position, dimension, constant) + min;
            if (position > max)
              return +rubberband(position - max, dimension, constant) + max;
            return position;
          };

          const maxDistance = that.dragDistance * 5;
          if (that.reachTop && that.deltaY >= 0 && that.deltaY < maxDistance) {
            that.distance = Math.max(
              rubberbandIfOutOfBounds(
                that.deltaY,
                0,
                0,
                that.dragDistance * 3,
                0.6
              ),
              0
            );
          }
        },
        stop(event) {
          if (
            that.reachTop &&
            that.contains(event.e.target) &&
            this.isTouchable
          )
            return;
          if (that.status === "loosing") {
            that.distance = that.dragDistance;
            that.isLoading = true;
            that.$emit("refresh");
            const timer = setTimeout(() => {
              console.log("setTimeout");
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
        }
      });
    },
    genLoading(h) {
      return h("div", { class: "yn-pull-refresh-loading" }, [
        h(genComponentName("spin"), {
          props: {
            tip: this.loadingStatusText,
            textDirection: "horizontal",
            size: "small"
          }
        })
      ]);
    },
    genDraggingText(h) {
      return h("div", { class: "yn-pull-refresh-dragging-text" }, [
        h("span", {}, this.refreshText)
      ]);
    },
    genDraggingWrapper(h) {
      return h(
        "div",
        {
          class: "yn-pull-refresh-wrapper",
          style: { height: `${this.dragDistance}px` },
          directives: [{ name: "show", value: !!this.distance }]
        },
        [
          this.status === "loading"
            ? this.genLoading(h)
            : this.genDraggingText(h)
        ]
      );
    },
    transitionend() {
      console.log("运动结束");
      this.fullyStoped = true;
    }
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
    }
  },
  render(h) {
    return h("div", { class: ["yn-pull-refresh"], style: this.refreshStyle, on: { transitionend: this.transitionend } }, [
      this.genDraggingWrapper(h),
      this.slots()
    ]);
  }
});
