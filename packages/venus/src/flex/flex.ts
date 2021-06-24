/*
* @Author: Just be free
* @Date:   2020-09-22 15:24:40
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-24 16:59:19
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import { hyphenate, camelize } from "@dullar/cube";
import { ValidFlexAttribute } from "./types";
import { h } from "vue";
class Props {
  flexDirection?: string
  flexWrap?: string
  justifyContent?: string
  alignItems?: string
  alignContent?: string
  xs?: string
  sm?: string
  md?: string
  lg?: string
  fixBottomLine = prop<boolean>({ default: false })
}
@Options({
  name: "VFlex"
})
export default class VFlex extends mixins(Queen).with(Props) {
  public static componentName = "VFlex";
  isValidColumnsAttribute(key: ValidFlexAttribute): boolean {
    const validates = ["xs", "sm", "md", "lg"];
    return validates.includes(key);
  }
  isValidColumnNumber(v: number): boolean {
    const value = Math.abs(v);
    return value >= 1 && value <= 12;
  }
  isValidFlexAttributeAndValue(key: ValidFlexAttribute, value: string) {
    const validates = {
      flexDirection: ["row", "rowReverse", "column", "columnReverse"],
      flexWrap: ["nowrap", "wrap", "wrapReverse"],
      justifyContent: [
        "flexStart",
        "flexEnd",
        "center",
        "spaceBetween",
        "spaceAround"
      ],
      alignItems: ["flexStart", "flexEnd", "center", "baseline", "stretch"],
      alignContent: [
        "flexStart",
        "flexEnd",
        "center",
        "spaceBetween",
        "spaceAround",
        "stretch"
      ]
    };
    return (key in validates) && validates[key].indexOf(value) > -1;
  }
  translateAttrsToClassName(prefix = "v-"): Array<string> {
    const className: string[] = [];
    for (let [attribute, value] of Object.entries(this.$props)) {
      if (this.isValidColumnsAttribute(attribute as ValidFlexAttribute)) {
        if (this.isValidColumnNumber(parseInt(value as string))) {
          className.push(`${prefix}${attribute}-col-${value}`);
        }
      } else {
        if (this.isValidFlexAttributeAndValue(attribute as ValidFlexAttribute, camelize(value as string))) {
          className.push(`${prefix}${hyphenate(attribute as string)}-${hyphenate(value as string)}`);
        }
      }
    }
    return className;
  }
  render() {
    const className = this.translateAttrsToClassName();
    const fix = this.fixBottomLine ? "v-flex-fix-bottom-line" : "";
    return h("div", { class: ["v-flex", ...className, fix] }, { default: () => this.getSlots() });
  }
}