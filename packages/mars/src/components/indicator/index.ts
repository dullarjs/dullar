/*
 * @Author: Just be free
 * @Date:   2020-02-14 15:51:17
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-06-16 10:19:33
 * @E-mail: justbefree@126.com
 */

import YnIndicator from "./indicator";
import { extend } from "../mixins/rendered";
import { AnyObject } from "@/types/index.js";
const IndicatorConstructor = extend(YnIndicator);
let instance!: AnyObject;
export default {
  bodyOverflow: "",
  lockScreen: false,
  open(options: AnyObject = {}) {
    if (!instance) {
      instance = new IndicatorConstructor({
        el: document.createElement("div"),
      });
    }
    if (instance.visible) {
      return false;
    }
    const {
      lockScreen,
      transparent = true,
      spinType = "snake",
      spinColor = "#ccc",
      background,
      size = 40,
    } = options;
    this.lockScreen = lockScreen;
    instance.text = typeof options === "string" ? options : options.text || "";
    instance.spinType = spinType;
    instance.spinColor = spinColor;
    instance.background = background;
    instance.size = size;
    instance.transparent = transparent;
    if (lockScreen) {
      this.bodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    document.body.appendChild(instance.$el);
    instance.rendered(() => {
      instance.visible = true;
    });
  },
  close() {
    if (instance) {
      if (this.lockScreen) {
        document.body.style.overflow = this.bodyOverflow;
      }
      instance.visible = false;
    }
  }
}
