import { AnyObject, Callback } from "@/types";

export const encrypt = (str = "") => {
  return String(str).replace(/^(\S{2})(\S+)(\S{2})$/, "$1******$3");
};
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
export const valueEquals = (a: string | number | (number | string)[], b: string | number | (number | string)[]) => {
  if (a === b) return true;
  if (!(a instanceof Array)) return false;
  if (!(b instanceof Array)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};
export const getValueByPath = function(object: AnyObject, prop: string) {
  prop = prop || '';
  const paths = prop.split('.');
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) break;

    if (i === j - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
};
export const isIE = function() {
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    return true;
  } else {
    return false;
  }
};

export const isEdge = function() {
  return navigator.userAgent.indexOf('Edge') > -1;
};

export const isFirefox = function() {
  return !!window.navigator.userAgent.match(/firefox/i);
};

function extend(to: AnyObject, _from: any[]) {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to;
}

export function toObject(arr: any[]) {
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
}
export const isString = (value: unknown) => {
  return Object.prototype.toString.call(value) === "[object String]";
};
