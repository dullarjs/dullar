/*
 * @Author: Just be free
 * @Date:   2020-04-01 13:26:46
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-04-01 13:32:45
 * @E-mail: justbefree@126.com
 */

import { isObject, isDef } from ".";
const { hasOwnProperty } = Object.prototype;

function assignKey(to, from, key) {
  const val = from[key];
  if (!isDef(val)) {
    return;
  }
  if (!hasOwnProperty.call(to, key) || !isObject(val)) {
    to[key] = val;
  } else {
    // eslint-disable-next-line no-use-before-define
    to[key] = deepAssign(Object(to[key]), from[key]);
  }
}

export function deepAssign(to, from) {
  Object.keys(from).forEach((key) => {
    assignKey(to, from, key);
  });
  return to;
}
