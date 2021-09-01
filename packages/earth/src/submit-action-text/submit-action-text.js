/*
 * @Author: Just be free
 * @Date:   2021-01-12 15:40:16
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-01-12 15:41:47
 * @E-mail: justbefree@126.com
 */

import { defineComponent } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
export default defineComponent({
  name: "SubmitActionText",
  mixins: [slotsMixins],
  render(h) {
    return h("div", { class: ["yn-submit-action-text"] }, [this.slots()]);
  },
});
