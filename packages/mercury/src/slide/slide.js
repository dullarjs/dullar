/*
* @Author: Just be free
* @Date:   2021-09-13 15:18:42
* @Last Modified by:   Just be free
* @Last Modified time: 2021-09-13 20:29:35
* @E-mail: justbefree@126.com
*/
import { defineComponent, genComponentName } from "../modules/component";
import { touchMixins } from "../mixins/touch";
import { slotsMixins } from "../mixins/slots";
import { preventDefault } from "../modules/event";
const TRIGGER_VALUE = 20;
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
    slide() {
      const that = this;
      this.bindEvent(this.$refs.container, {
        dragging(event) {
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
          const { target } = event;
          if (that.deltaX > 0 && !that.opened || that.deltaX === 0) return;
          that.dragging = false;
          that.className = "";
          if (that.deltaX < 0) {
            if (Math.abs(that.deltaX) > TRIGGER_VALUE) {
              target.style.transform = `translate3D(-${that.buttonWidth}px, 0, 0)`;
              that.opened = true;
            } else {
              target.style.transform = `translate3D(0, 0, 0)`;
              that.opened = false;
            }
          } else {
            if (Math.abs(that.deltaX) > TRIGGER_VALUE) {
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
      const iWidth = buttons[0].children.length * this.width;
      const deviceWidth = window.screen.availWidth;
      this.buttonWidth = iWidth;
      return h("div", { class: ["yn-slide"] }, [
        h("div", { ref: "container", style: { width: `${iWidth + deviceWidth}px` }, class: ["slide-slots", this.className] }, [
          h("div", { style: { width: `${deviceWidth}px` }, class: ["content-slot"] }, [
            this.slots("content")
          ]),
          h("div", { style: { width: `${iWidth}px` }, class: ["button-slot"] }, [
            h(genComponentName("flex"), { props: { justifyContent: "spaceAround" } },
              Array.apply(null, buttons[0].children).map(button => {
                return h(genComponentName("flex-item"), {}, [button])
              })
            )
          ])
        ])
      ]);
    }
  }
});