/*
 * @Author: Just be free
 * @Date:   2020-01-02 11:01:42
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-26 14:05:50
 */
import "./style/index.less";
import { defineComponent } from "../modules/component";
import { hyphenate, camelize } from "../modules/utils";
import { slotsMixins } from "../mixins/slots";
export default defineComponent({
  name: "FlexItem",
  mixins: [slotsMixins],
  props: {
    flex: {
      type: [String, Number],
      default: "initial",
    },
    order: {
      type: [Number, String],
      default: 0,
    },
    alignSelf: {
      type: String,
      default: "auto",
    },
  },
  methods: {
    isValidAlignSelfValue() {
      const VALIDE_ALIGN_SELF_VALUE = [
        "auto",
        "flexStart",
        "center",
        "flexEnd",
        "baseline",
        "stretch",
      ];
      return VALIDE_ALIGN_SELF_VALUE.indexOf(camelize(this.alignSelf)) > -1;
    },
    handleClick() {
      this.$emit("click");
    },
  },
  render(h) {
    const className = this.isValidAlignSelfValue()
      ? `align-self-${hyphenate(this.alignSelf)}`
      : "align-self-auto";
    return h(
      "div",
      {
        class: ["yn-flex-item", className],
        style: {
          flex: this.flex !== "none" && this.flex,
          order: this.order !== "none" && this.order,
        },
        on: { click: this.handleClick },
      },
      this.slots()
    );
  },
});
