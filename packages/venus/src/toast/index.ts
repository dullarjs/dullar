/*
* @Author: Just be free
* @Date:   2020-09-23 16:16:39
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-23 16:30:45
* @E-mail: justbefree@126.com
*/
import VToast from "./toast";
import { isString } from "@dullar/cube";
import { renderDOM } from "../component/renderDOM";
import { nextTick } from "vue";
export interface ToastOptions {
  message: string;
  position: "middle" | "bottom" | "top";
  duration: number;
  type: string;
}
const removeDom = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.parentNode) {
    target.parentNode.removeChild(target);
  }
};
const Toast = (options: ToastOptions) => {
  const { message, position, duration = 2000, type } = options;
  const computedMessage = message || (isString(options) ? options : "");
  const instance = renderDOM(VToast, { message: computedMessage, position, type }, { default: () => [] });
  const ctx = instance.ctx;
  ctx.setClosed(false);
  clearTimeout(ctx.timer);
  document.body.appendChild(ctx.getDomTree() as HTMLElement);
  nextTick(() => {
    ctx.setVisiable(true);
    ctx.getDomTree().removeEventListener("transitionend", removeDom, false);
    ~duration &&
      (ctx.timer = setTimeout(() => {
        if (ctx.closed) {
          return false;
        }
        ctx.close(() => {
          ctx.getDomTree().addEventListener("transitionend", removeDom, false);
        });
      }, duration));
  });
  return ctx;
};

export default Toast;
