/*
* @Author: Just be free
* @Date:   2021-06-11 14:20:36
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-11 14:20:38
* @E-mail: justbefree@126.com
*/
import { BemParserContext, ConfigOptions } from "../types";
class BEM {
  static blockPrefix = "yui";
  static modifierSeparator = "--";
  static elementSeparator = "__";

  public static config(options: ConfigOptions): void {
    console.log("pass BEM config ", options);
    const {
      blockPrefix = "yui",
      modifierSeparator = "--",
      elementSeparator = "__"
    } = options;
    BEM.blockPrefix = blockPrefix;
    BEM.modifierSeparator = modifierSeparator;
    BEM.elementSeparator = elementSeparator;
  }
  public static BlockParser(name: BemParserContext): string {
    if (typeof name === "string") {
      return `${BEM.blockPrefix}${name}`;
    } else {
      const key: string = Object.keys(name)[0];
      const value = name[key];
      if (typeof value === "string") {
        return `${BEM.blockPrefix}${key}${BEM.modifierSeparator}${value}`;
      } else {
        const attr: string = Object.keys(value)[0];
        const deepValue = value[attr];
        if (typeof deepValue === "boolean") {
          if (deepValue) {
            return `${BEM.blockPrefix}${key} ${BEM.blockPrefix}${key}${BEM.modifierSeparator}${attr}`;
          } else {
            return `${BEM.blockPrefix}${key}`;
          }
        } else {
          return `${BEM.blockPrefix}${key}${BEM.modifierSeparator}${attr}${BEM.modifierSeparator}${value[attr]}`;
        }
      }
    }
  }

  public static ElementParser(
    b: BemParserContext,
    e: BemParserContext
  ): string {
    if (typeof b === "string" && typeof e === "string") {
      return `${BEM.blockPrefix}${b}${BEM.elementSeparator}${e}`;
    } else if (typeof b === "string") {
      if (typeof e === "string") {
        return `${BEM.blockPrefix}${b}${BEM.elementSeparator}${e}`;
      } else {
        const key: string = Object.keys(e)[0];
        const value = e[key];
        if (typeof value === "string") {
          return `${BEM.blockPrefix}${b}${BEM.elementSeparator}${key} ${BEM.blockPrefix}${b}${BEM.elementSeparator}${key}${BEM.modifierSeparator}${value}`;
        } else {
          const attr = Object.keys(value)[0];
          const deepValue = value[attr];
          if (typeof deepValue === "boolean") {
            if (deepValue) {
              return `${BEM.blockPrefix}${b}${BEM.elementSeparator}${key} ${BEM.blockPrefix}${b}${BEM.elementSeparator}${key}${BEM.modifierSeparator}${attr}`;
            } else {
              return `${BEM.blockPrefix}${b}${BEM.elementSeparator}${key}`;
            }
          } else {
            return `${BEM.blockPrefix}${b}${BEM.elementSeparator}${key} ${BEM.blockPrefix}${b}${BEM.elementSeparator}${key}${BEM.modifierSeparator}${attr}${BEM.modifierSeparator}${value[attr]}`;
          }
        }
      }
    } else {
      const name: string = Object.keys(b)[0];
      return BEM.ElementParser(name, e);
    }
  }
  public static create(b: BemParserContext, e?: BemParserContext): string {
    return e ? BEM.ElementParser(b, e) : BEM.BlockParser(b);
  }
}

export default BEM;
export const createBem = (b: BemParserContext, e?: BemParserContext) => {
  return BEM.create(b, e);
};

// bem("block"); => block
// bem("block", "element"); => block__element
// bem({ block: "green" }); => block--green
// bem("block", { element: "active" }); => block__element block__element--active
// bem("block", { element: { "is-active": true } }); => block__element block__element--is-active
// bem("block", { element: { "is-active": false } }); => block__element
// bem("block", { element: { "has-color": "black" } }); => block__element block__element--has-color--black
// bem({ block: "active" }, { element: "active" }); => block__element block__element--active
// bem({ block: { "is-show": true } }); => block block--is-show
// bem({ block: { "is-show": false } }); => block