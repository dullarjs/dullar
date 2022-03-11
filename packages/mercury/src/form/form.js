/*
 * @Author: tongh
 * @Date:   2021-09-27 14:49:59
 * @Last Modified by:   tongh
 * @Last Modified time: 2022-03-11 14:38:01
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
    labelWidth: {
      type: String,
      default: "120px",
    },
    labelPosition: {
      type: String,
      default: "left",
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    validate(callback) {
      const slots = this.$slots.default;
      let failed = false;
      slots.forEach((item) => {
        if (item.child.prop) {
          const value = this.model[item.child.prop];
          if (item.child.required) {
            const result = !!item.child.formPostMessage({value, validate: true})
            failed = failed || result;
          }
        }
      });
      callback(!failed);
    },
  },
  render(h) {
    return h(
      "form",
      {
        attrs: {
          class: ["yn-form"],
        },
      },
      this.slots()
    );
  },
});
