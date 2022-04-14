/*
 * @Author: Just be free
 * @Date:   2020-01-02 11:01:42
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-02-03 11:34:09
 */
import "./style/index.scss";
import { hyphenate, camelize } from "@/utils";
import { slotsMixins } from "../mixins/slots";
import { Component, Mixins } from "vue-property-decorator";
import Vue, { CreateElement } from "vue";
@Component({
  name: "YnFlexItem",
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
  }
})
export default class YnFlexItem extends Mixins(Vue, slotsMixins) {
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
  render(h: CreateElement) {
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
