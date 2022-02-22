import { AnyObject, Callback } from "@/types";

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