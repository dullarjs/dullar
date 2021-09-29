/*
 * @Author: tongh
 * @Date:   2021-09-27 14:49:59
 * @Last Modified by:   tongh
 * @Last Modified time: 2021-09-27 14:49:59
 */
import { defineComponent } from "../modules/component";
import { slotsMixins } from "@/mixins/slots";
import { provideMixins } from "@/mixins/provide";
export default defineComponent({
  name: "Form",
  mixins: [slotsMixins, provideMixins("formWrap")],
  props: {
    rule: {
      type: Object,
      default() {},
    },
    model: {
      type: Object,
    },
    "label-width": {
      type: String,
      default: "120px",
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    validate(callback) {
      const slots = this.$slots.default;
      let count = 0;
      let boolean = true;
      slots.forEach((item) => {
        const value = this.model[item.child.prop];
        if (item.child.required) {
          count += Number(item.child.formPostMessage(value));
        }
      });
      if (count) boolean = false;
      else boolean = true;
      callback(boolean);
    },
  },
  render(h) {
    return h("div", {}, [
      h(
        "form",
        {
          attrs: {
            class: ["yn-form"],
          },
        },
        this.slots()
      ),
    ]);
  },
});
