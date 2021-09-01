/*
 * @Author: Just be free
 * @Date:   2020-04-21 14:25:00
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-05-14 18:49:45
 * @E-mail: justbefree@126.com
 */
import { defineComponent } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
import { injectMixins } from "../mixins/inject";
export default defineComponent({
  name: "TabItem",
  mixins: [slotsMixins, injectMixins("parent", { indexKey: "indexKey" })],
  props: {
    title: String,
    disabled: Boolean,
  },
  data() {
    return {};
  },
  render(h) {
    const slots = this.slots();
    const { currentTab } = this.parent;
    return h(
      "div",
      {
        class: ["yn-tab-item-content"],
        directives: [{ name: "show", value: currentTab === this.indexKey }],
      },
      slots
    );
  },
});
