/*
* @Author: Just be free
* @Date:   2021-09-13 15:18:42
* @Last Modified by:   Just be free
* @Last Modified time: 2021-09-22 16:56:25
* @E-mail: justbefree@126.com
*/
import { defineComponent, genComponentName } from "../modules/component";
import { touchMixins } from "../mixins/touch";
import { slotsMixins } from "../mixins/slots";
import { preventDefault } from "../modules/event";
import Flex from "../flex";
import FlexItem from "../flex-item";
export default defineComponent({
  name: "Slide",
  mixins: [touchMixins, slotsMixins],
  components: { Flex, FlexItem },
  props: {
    width: {
      type: Number,
      default: 40
    },
    trigger: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      dragging: false,
      className: "",
      opened: false
    }
  },
  methods: {
    reset() {
      const dom = this.$refs.container;
      dom.style.transform = `translate3D(0, 0, 0)`;
    },
    slide() {
      const that = this;
      this.bindEvent(this.$refs.container, {
        dragging(event) {
          if (that.direction === "vertical") return;
          const { target } = event;
          if (that.deltaX > 0 && !that.opened || that.deltaX < 0 && that.opened) return;
          that.dragging = true;
          that.className = "none";
          preventDefault(event);
          if (that.deltaX < 0) {
            target.style.transform = `translate3D(${that.bounceDeltaX}px, 0, 0)`;
          } else {
            target.style.transform = `translate3D(${-(that.buttonWidth - that.bounceDeltaX)}px, 0, 0)`;
          }
        },
        stop(event) {
          if (that.direction === "vertical" || that.deltaX === 0) return;
          const { target } = event;
          // if (that.deltaX > 0 && !that.opened || that.deltaX === 0) return;
          that.dragging = false;
          that.className = "";
          if (that.deltaX < 0) {
            if (Math.abs(that.deltaX) > that.trigger) {
              target.style.transform = `translate3D(-${that.buttonWidth}px, 0, 0)`;
              that.opened = true;
            } else {
              target.style.transform = `translate3D(0, 0, 0)`;
              that.opened = false;
            }
          } else {
            if (Math.abs(that.deltaX) > that.trigger) {
              target.style.transform = `translate3D(0, 0, 0)`;
              that.opened = false;
            } else {
              target.style.transform = `translate3D(-${that.buttonWidth}px, 0, 0)`;
              that.opened = true;
            }
          }
        }
      });
    }
  },
  mounted() {
    this.slide();
  },
  render(h) {
    const buttons = this.slots("buttons");
    if (Array.isArray(buttons) && buttons.length > 0) {
      const iWidth = buttons.length * this.width;
      const deviceWidth = window.screen.availWidth;
      this.buttonWidth = iWidth;
      return h("div", { class: ["yn-slide"] }, [
        h("div", { ref: "container", style: { width: `${iWidth + deviceWidth}px` }, class: ["slide-slots", this.className] }, [
          h("div", { style: { width: `${deviceWidth}px` }, class: ["content-slot"] }, [
            this.slots("content")
          ]),
          h("div", { style: { width: `${iWidth}px` }, class: ["button-slot"] }, [
            h(genComponentName("flex"), { props: { justifyContent: "spaceBetween" } },
              Array.apply(null, buttons).map(button => {
                return h(genComponentName("flex-item"), { props: { flex: 1 } }, [button])
              })
            )
          ])
        ])
      ]);
    }
  }
});