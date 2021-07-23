/*
 * @Author: Just be free
 * @Date:   2020-04-24 17:12:15
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-05-14 18:47:30
 * @E-mail: justbefree@126.com
 */
import { defineComponent } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
export default defineComponent({
  name: "SubmitActionPopupContent",
  mixins: [slotsMixins],
  render(h) {
    return h("div", { class: "yn-submit-action-popup-content" }, [
      this.slots(),
    ]);
  },
});
