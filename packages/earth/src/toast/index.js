/*
 * @Author: Just be free
 * @Date:   2020-01-17 15:28:53
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-05-15 10:09:37
 * @E-mail: justbefree@126.com
 */
import { install } from "../modules/component";
import { extend } from "../mixins/rendered";
import { isString } from "../modules/utils";
import YnToast from "./toast";
install(YnToast);
const YnToastConstructor = extend(YnToast);
const toastPool = [];
const removeDom = (event) => {
  if (event.target.parentNode) {
    event.target.parentNode.removeChild(event.target);
  }
};
const getInstance = () => {
  if (toastPool.length > 0) {
    const instance = toastPool[0];
    toastPool.splice(0, 1);
    return instance;
  }
  return new YnToastConstructor({
    el: document.createElement("div"),
  });
};
const returnAnInstance = (context) => {
  if (context) {
    toastPool.push(context);
  }
};
YnToastConstructor.prototype.close = function () {
  this.visible = false;
  this.closed = true;
  this.$el.addEventListener("transitionend", removeDom, false);
  returnAnInstance(this);
};
const Toast = (options = {}) => {
  const { message, position, duration = 3000 } = options;
  const instance = getInstance();
  instance.closed = false;
  clearTimeout(instance.timer);
  instance.message = message || (isString(options) ? options : "");
  instance.setPosition(position);
  document.body.appendChild(instance.$el);
  instance.rendered(() => {
    instance.visible = true;
    instance.$el.removeEventListener("transitionend", removeDom, false);
    ~duration &&
      (instance.timer = setTimeout(() => {
        if (instance.closed) {
          return false;
        }
        instance.close();
      }, duration));
  });
  return instance;
};
export default Toast;
