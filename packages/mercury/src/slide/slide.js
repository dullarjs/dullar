/*
* @Author: Just be free
* @Date:   2021-09-13 15:18:42
* @Last Modified by:   Just be free
* @Last Modified time: 2021-10-09 14:57:42
* @E-mail: justbefree@126.com
*/
import { defineComponent, genComponentName } from "../modules/component";
import { touchMixins } from "../mixins/touch";
import { slotsMixins } from "../mixins/slots";
import { preventDefault } from "../modules/event";
import Flex from "../flex";
import FlexItem from "../flex-item";
import { EventBus } from "../modules/event/bus";
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
    },
    groupName: String,
    uid: String
  },
  data() {
    return {
      dragging: false,
      opened: false
    }
  },
  methods: {
    reset() {
      const dom = this.$refs.container;
      if (dom) {
        dom.style.transform = `translate3D(0, 0, 0)`;
      }
    },
    deregister() {
      if (this.groupName && this.uid) {
        const groups = EventBus.$data.globalProperties[this.groupName];
        if (groups && groups[this.uid]) {
          delete EventBus.$data.globalProperties[this.groupName][this.uid];
        }
      }
    },
    slide() {
      const that = this;
      this.bindEvent(this.$refs.container, {
        dragging(event) {
          if (that.direction === "vertical") return;
          const { target } = event;
          if (that.deltaX > 0 && !that.opened || that.deltaX < 0 && that.opened) return;
          that.dragging = true;
          preventDefault(event);
          if (that.deltaX < 0) {
            target.style.transform = `translate3D(${that.bounceDeltaX}px, 0, 0)`;
          } else {
            target.style.transform = `translate3D(${-(that.buttonWidth - that.bounceDeltaX)}px, 0, 0)`;
          }
        },
        stop(event) {
          that.dragging = false;
          if (that.groupName && that.uid) {
            const groups = EventBus.$data.globalProperties[that.groupName];
            Object.keys(groups).map(name => {
              if (name !== that.uid) {
                if (groups[name].$data.opened || groups[name].$data.dragging) {
                  groups[name].reset();
                } else {
                  if (groups[name].$data.dragging) {
                    groups[name].reset();
                  }
                }
              }
            });
          }
          if (that.direction === "vertical" || that.deltaX === 0) {
            // that.reset();
            return;
          }
          const { target } = event;
          // if (that.deltaX > 0 && !that.opened || that.deltaX === 0) return;
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
          that.$emit("transitionEnd", that.opened);
        }
      });
    }
  },
  mounted() {
    // EventBus
    if (this.groupName && this.uid) {
      const groups =  EventBus.$data.globalProperties[this.groupName] || {};
      EventBus.$set(EventBus.$data.globalProperties, this.groupName, { ...groups, [this.uid]: this });
    }
    this.slide();
  },
  destroyed() {
    this.deregister();
  },
  deactivated() {
    this.deregister();
  },
  render(h) {
    const buttons = this.slots("buttons");
    if (Array.isArray(buttons) && buttons.length > 0) {
      const iWidth = buttons.length * this.width;
      const deviceWidth = window.innerWidth;
      this.buttonWidth = iWidth;
      return h("div", { class: ["yn-slide"] }, [
        h("div", { ref: "container", style: { width: `${iWidth + deviceWidth}px` }, class: ["slide-slots"] }, [
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