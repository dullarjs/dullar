/*
 * @Author: Just be free
 * @Date:   2020-03-19 17:32:29
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-03-19 22:07:41
 * @E-mail: justbefree@126.com
 */
const overflowScrollReg = /scroll|auto/i;
export const getScroller = (el, root = window) => {
  let node = el;
  while (
    node &&
    node.tagName !== "HTML" &&
    node.nodeType === 1 &&
    node !== root
  ) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowScrollReg.test(overflowY)) {
      if (node.tagName !== "BODY") {
        return node;
      }
      // see: https://github.com/youzan/vant/issues/3823
      const { overflowY: htmlOverflowY } = window.getComputedStyle(
        node.parentNode
      );
      if (overflowScrollReg.test(htmlOverflowY)) {
        return node;
      }
    }
    node = node.parentNode;
  }
  return root;
};
