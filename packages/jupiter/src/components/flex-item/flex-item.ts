/*
 * @Author: Just be free
 * @Date:   2020-01-02 11:01:42
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-02-03 11:34:09
 */
import "./style/index.scss";
import { hyphenate, camelize } from "@/utils";
import { SlotsMixins } from "../mixins/slots";
import { Vue, Options, prop, mixins } from "vue-class-component";
import { h } from "vue";
class Props {
  flex = prop<string|number>({ default: "initial" })
  order = prop<string|number>({ default: 0 })
  alignSelf = prop<string>({ default: "auto" })
}
@Options({
  name: "YnFlexItem"
})
export default class YnFlexItem extends mixins(Vue, SlotsMixins).with(Props) {
  static componentName = "YnFlexItem";

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
  }
  handleClick() {
    this.$emit("click");
  }
  render() {
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
  }
}
