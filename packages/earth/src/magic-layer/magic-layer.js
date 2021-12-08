/*
 * @Author: Just be free
 * @Date:   2021-12-06 16:01:58
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-12-08 15:30:04
 * @E-mail: justbefree@126.com
 */
import { defineComponent } from "../modules/component";
import { touchMixins } from "../mixins/touch";
import { getOffset, addClass, removeClass } from "../modules/dom";
import { getPropertyValue } from "../modules/dom/style";
import { move } from "../modules/dom/animate/move";
// genComponentName
import Flex from "../flex";
import FlexItem from "../flex-item";
// import { getScrollTop } from "../modules/dom";
// import { on, off, preventDefault } from "../modules/event";
import { preventDefault } from "../modules/event";
// import { EventBus } from "../modules/event/bus";
import { slotsMixins } from "../mixins/slots";
export default defineComponent({
  name: "MagicLayer",
  mixins: [slotsMixins, touchMixins],
  components: { Flex, FlexItem },
  props: {
    bottomHeight: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      rect: {
        height: window.innerHeight,
      },
    };
  },
  methods: {
    handleTransitionend() {
      console.log("运动结束");
    },
    startMove(el, b = 0, c = 0, fn) {
      const { vertical } = this;
      const attr = vertical ? "top" : "left";
      move(el, { attr, b, c }, () => {
        fn && typeof fn === "function" && fn.call(this, el);
      });
    },
    drag() {
      const el = this.$el;
      if (!el) {
        return;
      }
      this.el = el;
      const that = this;
      let startTime = 0;
      const innerLayer = this.$refs.innerLayer;
      const innerLayerHeight = innerLayer.offsetHeight;
      this.bindEvent(el, {
        start() {
          that.dragging = true;
          startTime = Date.now();
          const offset = getOffset(el);
          that.currentTop = offset.top;
        },
        dragging(e) {
          preventDefault(e.e);
          let top = that.currentTop + that.deltaY;
          innerLayer.style.height = `${innerLayerHeight + top}px`;
          innerLayer.style.marginTop = `-${top}px`;
          el.style.transform = `translate3d(0, ${top}px, 0)`;
          removeClass(innerLayer, "animated");
          // innerLayer.style.transition = "none";
        },
        stop(e) {
          const currentTop = parseInt(getPropertyValue(innerLayer, "height"));
          // console.log("currentTop = ", currentTop);
          addClass(innerLayer, "animated");
          // const offset = getOffset(el);
          // console.log(Math.abs(offset.top), that.rect.height);
          if (currentTop > that.rect.height / 2) {
            console.log("过了一半");
          } else {
            // back where it comes from
            // that.startMove();
            that.$refs.innerLayer.style.height = `${innerLayerHeight}px`;
            that.$refs.innerLayer.style.marginTop = "auto";
            el.style.transform = "translate3D(0, 0, 0)";
          }
          that.dragging = false;
          const timeDiff = Date.now() - startTime;
          if (timeDiff < 200) {
            preventDefault(e.e);
            that.$emit("click");
            return;
          }
        },
      });
    },
  },
  mounted() {
    this.drag();
  },
  render(h) {
    return h("div", { class: ["yn-magic-layer"] }, [
      h(
        "div",
        {
          class: ["yn-magic-layer-item"],
          ref: "innerLayer",
          on: { transitionend: this.handleTransitionend },
        },
        [this.slots("inner")]
      ),
      h("div", { class: ["yn-magic-layer-item"] }, [this.slots("outside")]),
    ]);
  },
});
