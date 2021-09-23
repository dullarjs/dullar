/*
 * @Author: Just be free
 * @Date:   2020-04-28 15:42:16
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-23 18:53:52
 * @E-mail: justbefree@126.com
 */

import { defineComponent, genComponentName } from "../modules/component";
import { getScrollTop } from "../modules/dom";
import { getScroller } from "../modules/dom/scroll";
import { slotsMixins } from "../mixins/slots";
import { touchMixins } from "../mixins/touch";
import { on, off } from "../modules/event";
import Spin from "../spin";
export default defineComponent({
  name: "PullRefresh",
  mixins: [slotsMixins, touchMixins],
  components: { Spin },
  props: {
    loadingText: String,
    topDraggingTip: {
      type: String,
      default: "松手下拉刷新",
    },
    topTipFixed: Boolean,
    bottomDraggingTip: {
      type: String,
      default: "松手刷新",
    },
    bottomTipFixed: Boolean,
    loading: Boolean,
  },
  data() {
    return {
      className: "",
      dragging: false,
      scrollElement: null,
      scrollTop: 0,
    };
  },
  mounted() {
    this.pull();
  },
  beforeDestroy() {
    off(this.scrollElement, "scroll", this.handleScroll);
  },
  methods: {
    setScrollTop(top) {
      this.scrollElement.scrollTop = top;
    },
    handleScroll(e) {
      this.scrollTop = getScrollTop(e.target);
      this.$emit("scroll", e);
    },
    scroll() {
      this.scrollElement = getScroller(this.$el);
      on(this.scrollElement, "scroll", this.handleScroll);
    },
    pull() {
      this.scroll();
      const that = this;
      this.bindEvent(this.$el, {
        dragging(event) {
          const { target } = event;
          if (!that.loading) {
            if (that.deltaY > 0 && that.scrollTop <= 10) {
              that.$emit("pullRefresh", { direction: "top", status: "dragging" });
              that.dragging = true;
              that.className = "none";
              target.style.transform = `translate3D(0, ${that.bounceDeltaY}px, 0)`;
            } else if (
              that.deltaY < 0 &&
              that.scrollTop -
                target.scrollHeight +
                that.scrollElement.offsetHeight >=
                0
            ) {
              that.$emit("pullRefresh", { direction: "bottom", status: "dragging" });
              that.dragging = true;
              that.className = "none";
              target.style.transform = `translate3D(0, ${that.bounceDeltaY}px, 0)`;
            }
          }
        },
        stop(event) {
          const { target } = event;
          if (!that.loading) {
            if (that.deltaY > 0 && that.scrollTop <= 10) {
              that.$emit("pullRefresh", { direction: "top", status: "stoped" });
              that.className = "";
              that.dragging = false;
              target.style.transform = "translate3D(0, 0, 0)";
            } else if (
              that.deltaY < 0 &&
              that.scrollTop -
                target.scrollHeight +
                that.scrollElement.offsetHeight >=
                0
            ) {
              that.$emit("pullRefresh", { direction: "bottom", status: "stoped" });
              that.className = "";
              that.dragging = false;
              target.style.transform = "translate3D(0, 0, 0)";
            }
          }
        },
      });
    },
    genLoading(h) {
      if (this.loading) {
        return h("div", { class: ["yn-pull-refresh-loading"] }, [
          h("span", {}, [this.loadingText]),
          h(genComponentName("spin"), { props: { type: "tripleBounce" } }, []),
        ]);
      }
    },
    genDraggingTip(h, direction) {
      const text =
        (direction === "top") ? this.topDraggingTip : this.bottomDraggingTip;
      return h("div", { class: ["yn-pull-refresh-draggin-text", direction] }, [
        h("span", {}, [text]),
      ]);
    },
    genDraggingText(h, direction) {
      if (this.topTipFixed) {
        if (this.dragging) {
          return this.genDraggingTip(h, direction);
        }
      }
      if (this.dragging) {
        if (this.deltaY >= 20 && direction === "top") {
          return this.genDraggingTip(h, "top");
        } else if (this.deltaY <= 0 && direction === "bottom") {
          return this.genDraggingTip(h, "bottom");
        }
      }
    },
  },
  render(h) {
    return h("div", { class: ["yn-pull-refresh", this.className] }, [
      this.genLoading(h),
      this.genDraggingText(h, "top"),
      this.slots(),
      h("div", { class: ["bottom-dragging-tip-box"] }, [
        this.genDraggingText(h, "bottom"),
      ]),
    ]);
  },
});
