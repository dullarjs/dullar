/*
 * @Author: Just be free
 * @Date:   2020-05-13 17:43:23
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-05-14 18:48:01
 * @E-mail: justbefree@126.com
 */
import { defineComponent } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
export default defineComponent({
  name: "SubmitActionValue",
  mixins: [slotsMixins],
  render(h) {
    return h("div", { class: ["yn-submit-action-value"] }, [this.slots()]);
  },
});
