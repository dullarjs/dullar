import { AnyObject, Callback } from "@/types";

export const capitalize = (str = "") => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const hyphenate = (str = "") => {
  return str.replace(/\B([A-Z])/g, "-$1").toLowerCase();
};
export const camelize = (str = "") => {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
};
export const isPromise = (obj: AnyObject) => {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
};
export const throttle = (callback: Callback, delay = 800) => {
  let timer: number | null = null;
  return function(this: void, ...rest: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback.apply(this, rest);
      timer = null;
    }, delay);
  };
};