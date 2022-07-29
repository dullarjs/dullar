/*
 * @Author: Just be free
 * @Date:   2020-01-02 11:01:34
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-09-23 14:37:30
 * @E-mail: justbefree@126.com
 */
import "./style/index.scss";
import { hyphenate, camelize, isString } from "@/utils";
import { SlotsMixins } from "../mixins/slots";
const VALID_CHILD_COMPONENT = "flex-item";
import { h } from "vue";
import { Vue, Options, prop, mixins } from "vue-class-component";
import { AnyObject } from "@/types";
import FlexItem from "@/components/flex-item";
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
  name: "YnFlex",
  components: {
    FlexItem
  }
})
export default class YnFlex extends mixins(Vue, SlotsMixins).with(Props) {
  static componentName = "YnFlex";

  VUE_APP_PREFIX = "yn";
  isValidColumnsAttribute(key = "") {
    const validates = ["xs", "sm", "md", "lg"];
    return validates.indexOf(key) > -1;
  }
  isValidColumnNumber(val = "0") {
    const value = Math.abs(parseInt(val));
    return value >= 1 && value <= 12;
  }
  isValidFlexAttributeAndValue(key = "", value = "") {
    const argsLength = arguments.length;
    const validates: AnyObject = {
      flexDirection: ["row", "rowReverse", "column", "columnReverse"],
      flexWrap: ["nowrap", "wrap", "wrapReverse"],
      justifyContent: [
        "flexStart",
        "flexEnd",
        "center",
        "spaceBetween",
        "spaceAround",
      ],
      alignItems: ["flexStart", "flexEnd", "center", "baseline", "stretch"],
      alignContent: [
        "flexStart",
        "flexEnd",
        "center",
        "spaceBetween",
        "spaceAround",
        "stretch",
      ],
    };
    if (argsLength === 1) {
      return key in validates;
    } else if (argsLength === 2) {
      return key in validates && validates[key].indexOf(value) > -1;
    } else {
      return false;
    }
  }
  translateAttrsToClassName(prefix = "yn-") {
    const className = [];
    for (const [key, value] of Object.entries(this.$props)) {
      if (
        value &&
        isString(value) &&
        this.isValidFlexAttributeAndValue(key, camelize(value as string))
      ) {
        className.push(`${prefix}${hyphenate(key)}-${hyphenate(value as string)}`);
      }
      if (
        this.isValidColumnsAttribute(key) &&
        value &&
        this.isValidColumnNumber(value as string)
      ) {
        className.push(`${prefix}${key}-col-${value}`);
      }
    }
    return className;
  }
  render() {
    const prefix = this.VUE_APP_PREFIX;
    let validChildComponent = VALID_CHILD_COMPONENT;
    if (prefix !== "") {
      validChildComponent = `${prefix}-${VALID_CHILD_COMPONENT}`;
    }
    const slots = this.slots("default");
    const className = this.translateAttrsToClassName();
    const fix = this.fixBottomLine ? "yn-flex-fix-bottom-line" : "";
    return h(
      "div",
      {
        class: ["yn-flex", ...className, fix],
      },
      slots
    );
  }
}
