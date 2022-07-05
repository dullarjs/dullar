/*
 * @Author: Just be free
 * @Date:   2020-04-28 15:42:16
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-07-05 15:49:30
 * @E-mail: justbefree@126.com
 */

import { defineComponent, genComponentName } from "../modules/component";
import { getScrollTop } from "../modules/dom";
import { getScroller } from "../modules/dom/scroll";
import { slotsMixins } from "../mixins/slots";
import { touchMixins } from "../mixins/touch";
import { contains } from "../modules/dom/contains";
import Spin from "../spin";
export default defineComponent({
  name: "PullRefresh",
  mixins: [slotsMixins, touchMixins],
  components: { Spin },
  props: {
    loadingText: String,
    draggingTip: {
      type: String,
      default: "下拉刷新",
    },
    triggerLoadingText: {
      type: String,
      default: "松手刷新"
    },
    loadingSuccessText: {
      type: String,
      default: "加载完成"
    },
    loading: Boolean,
    cancelBubbles: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      className: "",
      dragging: false,
      scrollElement: null,
      scrollTop: 0,
      loadingSuccess: false,
      diffY: 0
    };
  },
  watch: {
    loading: function(nv, ov) {
      if (ov && !nv) {
        this.loadingSuccess = true;
        const t = setTimeout(() => {
          this.loadingSuccess = false;
          clearTimeout(t);
        }, 200);
      }
    }
  },
  // 如果被阻止冒泡的元素会动态渲染则通过computed的方式获取元素会有问题
  // computed: {
  //   bubbleDoms() {
  //     return this.cancelBubbles.map((i) => document.querySelector(i));
  //   },
  // },
  mounted() {
    this.pull();
  },
  beforeDestroy() {
    this.scrollElement.removeEventListener("scroll", this.handleScroll, false);
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
          if (that.contains(event.e.target)) return;
        },
        dragging(event) {
          if (that.contains(event.e.target)) return;
          const { target } = event;
          if (!that.loading && that.deltaY > 0 && that.scrollTop <= 10) {
            that.dragging = true;
            that.className = "none";
            target.style.transform = `translate3D(0, ${that.bounceDeltaY}px, 0)`;
          }
        },
        stop(event) {
          that.diffY = that.deltaY;
          if (that.contains(event.e.target)) return;
          const { target } = event;
          that.className = "";
          that.dragging = false;
          target.style.transform = "translate3D(0, 0, 0)";
          if (that.deltaY < 48) {
            return;
          }
          if (!that.loading && that.deltaY >= 48 && that.scrollTop <= 10) {
            that.$emit("pullRefresh", true);
          }
        },
      });
    },
    genLoading(h, type, text) {
      if (this.diffY < 48) return;
      return h("div", {
        class: ["yn-pull-refresh-loading"],
        directives: [{ name: "show", value: this[type] }]
      }, [
        this.loading && h(genComponentName("spin"), { class: ["loading-spin"], props: { type: "rotate-svg" } }, []),
        h("span", { class: ["text"] }, [this[text]]),
      ]);
    },
    genDraggingText(h) {
      let text = this.draggingTip;
      if (this.dragging && this.deltaY >= 20) {
        if (this.deltaY >= 48) {
          text = this.triggerLoadingText;
        }
        return h("div", { class: ["yn-pull-refresh-draggin-text"] }, [
          h("span", {}, [text]),
        ]);
      }
    },
  },
  render(h) {
    return h("div", { class: ["yn-pull-refresh", this.className] }, [
      this.genLoading(h, "loading", "loadingText"),
      this.genLoading(h, "loadingSuccess", "loadingSuccessText"),
      this.genDraggingText(h),
      this.slots(),
    ]);
  },
});
