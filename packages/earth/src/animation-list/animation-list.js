/*
 * @Author: Just be free
 * @Date:   2020-11-11 10:03:24
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-12-08 16:59:22
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
import Flex from "../flex";
import FlexItem from "../flex-item";
const VALID_CHILD_COMPONENT = "animation-list-item";
export default defineComponent({
  name: "AnimationList",
  props: {
    duration: {
      type: [Number, String],
      default: 600,
    },
    animationType: {
      type: String,
      default: "list",
      validator: function (name) {
        return ["list", "paragraph"].includes(name);
      },
    },
  },
  mixins: [slotsMixins],
  components: { Flex, FlexItem },
  methods: {
    handleBeforeEnter(el) {
      el.style.opacity = 0;
    },
    handleEnter(el, done) {
      let delay = el.getAttribute("dataindex") * 5 + 100;
      el.timer = setTimeout(() => {
        el.setAttribute(
          "style",
          `
          transition: opacity ${this.duration}ms;
          opacity: 1;
          animation: ${this.animationType}-one-by-one ${this.duration}ms infinite;
          animation-iteration-count: 1;
        `
        );
        done();
      }, delay);
    },
    handleAfterEnter(el) {
      clearTimeout(el.timer);
      const timer = setTimeout(() => {
        // el.style.animation = "no-animation 0ms infinite";
        el.setAttribute("style", "");
        clearTimeout(timer);
      }, this.getSlots().length * 5);
    },
    getSlots() {
      const prefix = this.VUE_APP_PREFIX;
      let validChildComponent = VALID_CHILD_COMPONENT;
      if (prefix !== "") {
        validChildComponent = `${prefix}-${VALID_CHILD_COMPONENT}`;
      }
      const slots = this.slots("default", {}, validChildComponent);
      return slots;
    },
  },
  render(h) {
    return h("div", { class: ["yn-animation-list"] }, [
      h(
        "transition-group",
        {
          props: { css: false, tag: `${this.VUE_APP_PREFIX}-flex` },
          class: [`${this.VUE_APP_PREFIX}-flex-direction-column`],
          on: {
            beforeEnter: this.handleBeforeEnter,
            enter: this.handleEnter,
            afterEnter: this.handleAfterEnter,
          },
        },
        Array.apply(null, this.getSlots()).map((item, key) => {
          return h(
            genComponentName("flex-item"),
            { key, attrs: { dataIndex: key } },
            [item]
          );
        })
      ),
    ]);
  },
});
