/*
 * @Author: Just be free
 * @Date:   2021-12-21 14:35:08
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-12-21 14:38:36
 * @E-mail: justbefree@126.com
 */

export const contains = (rootElement, el) => {
  if (rootElement.compareDocumentPosition) {
    return (
      rootElement === el || !!(rootElement.compareDocumentPosition(el) & 16)
    );
  }
  if (rootElement.contains && el.nodeType === 1) {
    return rootElement.contains(el) && rootElement !== el;
  }
  while ((el = el.parentNode)) {
    if (el === rootElement) {
      return true;
    }
  }
  return false;
};
