/*
 * @Author: Just be free
 * @Date:   2020-01-09 18:03:10
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-01-05 15:06:37
 */
export const hasOwnProperty = (obj, props) => {
  return Object.prototype.hasOwnProperty.call(obj, props);
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
export const isString = (value) => {
  return Object.prototype.toString.call(value) === "[object String]";
};
export const isNumber = (value) => {
  return typeof value === "number" && isFinite(value);
};
export const encrypt = (str = "") => {
  return String(str).replace(/^(\S{2})(\S+)(\S{2})$/, "$1******$3");
};
export const isDef = (value) => {
  return value !== undefined && value !== null;
};
export const isObject = (value) => {
  const type = typeof value;
  return value != null && type === "object";
};
export const drop = (arr, ele) => {
  if (Array.isArray(arr)) {
    if (Array.isArray(ele)) {
      ele.forEach((item) => {
        let index = arr.indexOf(item);
        if (index > -1) {
          arr.splice(index, 1);
        }
      });
    } else {
      let index = arr.indexOf(ele);
      if (index > -1) {
        arr.splice(index, 1);
      }
    }
  }
  return arr;
};
export const push = (arr, ele) => {
  if (Array.isArray(arr)) {
    if (Array.isArray(ele)) {
      ele.forEach((item) => {
        if (arr.indexOf(item) < 0) {
          arr.push(item);
        }
      });
    } else {
      if (arr.indexOf(ele) < 0) {
        arr.push(ele);
      }
    }
  }
};
export const isPromise = (obj) => {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
};
export const throttle = (callback, delay = 800) => {
  return function () {
    clearTimeout(callback.id);
    callback.id = setTimeout(() => {
      callback.apply(this, arguments);
    }, delay);
  };
};
// 判断是否是中文
export const isChineseCharacters = (str) => {
  return /^[\u4e00-\u9fa5]+$/i.test(str);
};
export const charLength = (str) => {
  return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
};
// 生成唯一字符串
export const guid = () => {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
};
export const clearBr = (str) => {
  const after = str.replace(/<\/?.+?>/g, "").replace(/[\r\n]/g, "");
  return after;
};
