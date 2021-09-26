/*
 * @Author: Just be free
 * @Date:   2020-11-11 10:27:56
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-26 16:53:30
 * @E-mail: justbefree@126.com
 */
import "./style";
import { defineComponent } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
export default defineComponent({
  name: "AnimationListItem",
  mixins: [slotsMixins],
  props: {
    height: [String, Number],
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
