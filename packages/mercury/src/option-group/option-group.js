/*
 * @Author: yegl
 * @Date: 2022-02-15 16:15:08
 * @Last Modified by: yegl
 * @Last Modified time: 2022-02-16 11:12:24
 * @E-mail: yglgzyx@126.com
 */
import { defineComponent } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
export default defineComponent({
  name: "OptionGroup",
  mixins: [slotsMixins],
  props: {
    label: [Number, String],
  },
  methods: {},
  render(h) {
    return h(
      "ul",
      {
        class: ["yn-option-list-item"],
      },
      [
        h("li", { class: ["yn-option-list-label"] }, [this.label]),
        this.slots("default"),
      ]
    );
  },
});
