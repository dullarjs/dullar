/*
 * @Author: Just be free
 * @Date:   2020-02-14 15:51:17
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-06-16 10:19:33
 * @E-mail: justbefree@126.com
 */

import YnIndicator from "./indicator";
import { ComponentPublicInstance, createVNode, render, VNode } from "vue";
import { AnyObject } from "@/types/index.js";
let instance!: VNode;
export default {
  bodyOverflow: "",
  lockScreen: false,
  open(options: AnyObject = {}) {
    const {
      lockScreen,
      transparent = true,
      spinType = "snake",
      spinColor = "#ccc",
      background,
      size = 40,
    } = options;
    const props = {
      background,
      size,
      transparent,
      spinType,
      spinColor,
      text: typeof options === "string" ? options : options.text || ""
    };
    const container = document.createElement('div')
    instance = createVNode(YnIndicator, props, []);
    render(instance, container)
    if ((instance.component!.proxy as ComponentPublicInstance<{ visible: boolean }>).visible) {
      return false;
    }
    
    this.lockScreen = lockScreen;
    if (lockScreen) {
      this.bodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    document.body.appendChild(container.firstElementChild!);
    (instance.component!.proxy as ComponentPublicInstance<{ visible: boolean }>).visible = true;
  },
  close() {
    if (instance) {
      if (this.lockScreen) {
        document.body.style.overflow = this.bodyOverflow;
      }
      (instance.component!.proxy as ComponentPublicInstance<{ visible: boolean }>).visible = false;
    }
  }
}
