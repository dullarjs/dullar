/*
 * @Author: Just be free
 * @Date:   2021-12-06 16:01:58
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-12-21 15:07:52
 * @E-mail: justbefree@126.com
 */
import { defineComponent } from "../modules/component";
import { touchMixins } from "../mixins/touch";
import { getOffset, getScrollTop, addClass, removeClass } from "../modules/dom";
import { getScroller } from "../modules/dom/scroll";
import { on, off, preventDefault } from "../modules/event";
import { slotsMixins } from "../mixins/slots";
import { contains } from "../modules/dom/contains";
export default defineComponent({
  name: "MagicLayer",
  mixins: [slotsMixins, touchMixins],
  props: {
    bottomHeight: {
      type: Number,
      default: 100,
    },
    triggerPoint: {
      type: Number,
      default: 50,
    },
    cancelBubbles: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      moved: false,
      opened: false,
      scrollElement: null,
      scrollTop: 0,
      executed: false,
      orginInnerLayerHeight: 0,
    };
  },
  computed: {
    bubbleDoms() {
      return this.cancelBubbles.map((i) => document.querySelector(i));
    },
  },
  methods: {
    init() {
      const el = this.$el;
      if (!el) return;
      this.scrollElement = getScroller(this.$el);
      on(this.scrollElement, "scroll", this.handleScroll);
    },
    destory() {
      off(this.scrollElement, "scroll", this.handleScroll);
    },
    handleScroll(e) {
      const scrollTop = getScrollTop(e.target);
      this.scrollTop = scrollTop;
      if (scrollTop > 0) {
        this.fold();
      }
    },
    handleTransitionstart() {
      this.$emit("transitionstart");
    },
    handleTransitionend() {
      if (!this.opened) {
        this.$refs.magicLayer.setAttribute("style", "");
      }
      this.$emit("transitionend", { opened: this.opened });
    },
    fold() {
      const el = this.$el;
      if (!el) return;
      const innerLayer = this.$refs.innerLayer;
      addClass(innerLayer, "animated");
      this.opened = false;
      this.$refs.innerLayer.style.height = `${this.orginInnerLayerHeight}px`;
      this.$emit("stoped", { height: this.orginInnerLayerHeight });
      this.$refs.innerLayer.style.marginTop = "auto";
      el.style.transform = null;
    },
    contains(target) {
      let contain = false;
      this.bubbleDoms.forEach((dom) => {
        if (dom && contains(dom, target)) {
          contain = true;
        }
      });
      return contain;
    },
    drag() {
      const el = this.$el;
      if (!el) return;
      this.el = el;
      const that = this;
      let startTime = 0;
      const innerLayer = this.$refs.innerLayer;
      const innerLayerHeight = innerLayer.offsetHeight;
      this.orginInnerLayerHeight = innerLayerHeight;
      this.bindEvent(el, {
        start(event) {
          if (that.contains(event.e.target)) return;
          startTime = Date.now();
          const offset = getOffset(el);
          that.currentTop = offset.top;
          that.$emit("dragstart");
        },
        dragging(e) {
          if (that.contains(e.e.target)) return;
          if (that.deltaY === 0) return;
          let l = 1;
          if (that.deltaY >= 0) {
            l = 1;
          } else {
            l = -1;
          }
          if (
            (that.opened && l < 0) ||
            (!that.opened && l > 0 && that.scrollTop === 0)
          ) {
            preventDefault(e.e);
            let top = l * that.currentTop + that.deltaY;
            if (
              (!that.opened && that.deltaY < 0) ||
              (that.opened && that.deltaY > 0)
            ) {
              that.moved = false;
              return true;
            }
            that.moved = true;
            innerLayer.style.height = `${innerLayerHeight + top}px`;
            that.$emit("dragging", { height: innerLayerHeight + top });
            innerLayer.style.marginTop = `-${top}px`;
            el.style.transform = `translate3d(0, ${top}px, 0)`;
            removeClass(innerLayer, "animated");
          }
        },
        stop(e) {
          if (that.contains(e.e.target)) return;
          if (that.deltaY === 0) return;
          if (!that.moved || that.scrollTop > 0) return;
          addClass(innerLayer, "animated");
          if (
            that.deltaY > that.triggerPoint ||
            (that.deltaY < 0 && Math.abs(that.deltaY) < that.triggerPoint)
          ) {
            that.opened = true;
            const actualHeight =
              document.documentElement.clientHeight - that.bottomHeight;
            that.$refs.innerLayer.style.marginTop = `-${
              actualHeight - innerLayerHeight
            }px`;
            that.$refs.innerLayer.style.height = `${actualHeight}px`;
            that.$emit("stoped", { height: actualHeight, opened: true });
            el.style.transform = `translate3D(0, ${
              actualHeight - innerLayerHeight
            }px, 0)`;
          } else if (
            (that.deltaY < 0 && Math.abs(that.deltaY) > that.triggerPoint) ||
            (that.deltaY > 0 && that.deltaY < that.triggerPoint)
          ) {
            // back where it comes from
            // that.startMove();
            that.opened = false;
            that.$refs.innerLayer.style.height = `${innerLayerHeight}px`;
            that.$emit("stoped", { height: innerLayerHeight, opened: false });
            that.$refs.innerLayer.style.marginTop = "auto";
            el.style.transform = "translate3D(0, 0, 0)";
          }
          const timeDiff = Date.now() - startTime;
          if (timeDiff < 200) {
            preventDefault(e.e);
            that.$emit("click", { opened: that.opened });
            return;
          }
        },
      });
    },
  },
  mounted() {
    this.init();
    this.drag();
  },
  activated() {
    this.init();
  },
  beforeDestroy() {
    this.destory();
  },
  deactivated() {
    this.destory();
  },
  render(h) {
    return h("div", { class: ["yn-magic-layer"], ref: "magicLayer" }, [
      h(
        "div",
        {
          class: ["yn-magic-layer-item"],
          ref: "innerLayer",
          on: {
            transitionstart: this.handleTransitionstart,
            transitionend: this.handleTransitionend,
          },
        },
        [this.slots("inner")]
      ),
      h("div", { class: ["yn-magic-layer-item"] }, [this.slots("outside")]),
    ]);
  },
});
