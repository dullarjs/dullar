/*
 * @Author: Just be free
 * @Date:   2020-11-11 10:27:56
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-12-15 17:15:58
 * @E-mail: justbefree@126.com
 */
import { defineComponent } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
import { injectMixins } from "../mixins/inject";
export default defineComponent({
  name: "AnimationListItem",
  mixins: [slotsMixins, injectMixins("parent")],
  props: {
    height: [String, Number],
  },
  activated() {
    const el = this.$el.parentNode;
    el.setAttribute(
      "style",
      `
      transition: opacity ${this.parent.duration}ms;
      opacity: 1;
      animation: ${this.parent.animationType}-one-by-one ${this.parent.duration}ms infinite;
      animation-iteration-count: 0;
    `
    );
  },
  render(h) {
    return h(
      "div",
      {
        class: ["yn-animation-list-item"],
        style: { height: `${this.height}px` },
      },
      this.slots()
    );
  },
});
