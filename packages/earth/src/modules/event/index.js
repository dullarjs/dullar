/*
 * @Author: Just be free
 * @Date:   2020-03-31 12:10:32
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-11-03 15:28:05
 * @E-mail: justbefree@126.com
 */
/* eslint-disable */

let passiveSupported = false;
try {
  let options = Object.defineProperty({}, "passive", {
    get: function () {
      passiveSupported = true;
    },
  });
  window.addEventListener("test", null, options);
} catch (err) {}
export const bind = (dom, type, fn, args, passive = true) => {
  const callback = (e) => {
    fn.call(this, e, args);
  };
  dom.addEventListener(
    type,
    callback,
    passiveSupported ? { passive, capture: false } : false
  );
  return () => {
    off(dom, type, callback);
  };
};
// https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
export const on = (dom, type, fn, passive = true) => {
  dom.addEventListener(
    type,
    fn,
    passiveSupported ? { passive, capture: false } : false
  );
};

export const off = (dom, type, fn) => {
  dom.removeEventListener(type, fn);
};

export const stopPropagation = (event) => {
  event &&
    typeof event.stopPropagation === "function" &&
    event.stopPropagation();
};
export const preventDefault = (evnet, isStopPropagation = false) => {
  if ((event && typeof event.cancelable !== "boolean") || event.cancelable) {
    event.preventDefault();
  }
  if (isStopPropagation) {
    stopPropagation(event);
  }
};
