/*
 * @Author: Just be free
 * @Date:   2020-12-29 14:37:19
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-12-29 14:43:14
 * @E-mail: justbefree@126.com
 */

export const getStyle = (element) => {
  return window.getComputedStyle(element);
};
export const getPropertyValue = (element, property) => {
  return getStyle(element).getPropertyValue(property);
};
