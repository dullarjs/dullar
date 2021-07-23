/*
 * @Author: Just be free
 * @Date:   2020-04-01 13:26:14
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-04-01 13:29:33
 * @E-mail: justbefree@126.com
 */
import { deepAssign } from "./deepAssign";
export function deepClone(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }
  if (typeof obj === "object") {
    return deepAssign({}, obj);
  }
  return obj;
}
