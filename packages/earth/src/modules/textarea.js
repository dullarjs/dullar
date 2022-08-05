/*
* @Author: Just be free
* @Date:   2022-08-05 12:24:00
* @Last Modified by:   Just be free
* @Last Modified time: 2022-08-05 13:30:30
* @E-mail: justbefree@126.com
*/
// options = { minHeight: 100, maxHeight: 200 }
import { getPropertyValue } from "./dom/style";
export const autoWrap = (elem, scrollElement, options) => {
  if (!elem) return;
  let scrollTop,
    extra = 0,
    height,
    padding = 0,
    minHeight = options.minHeight,
    maxHeight = options.maxHeight,
    style = elem.style;
  if (elem._length === elem.value.length) return;
  elem._length = elem.value.length;
  padding =
    parseInt(getPropertyValue(elem, "padding-top")) +
    parseInt(getPropertyValue(elem, "padding-bottom"));
  scrollTop = scrollElement.scrollTop;
  elem.style.height = minHeight + "px";
  if (elem.scrollHeight - padding > minHeight) {
    elem.setAttribute("wrapped", "wrapped");
  } else {
    elem.setAttribute("wrapped", "unwrapped");
  }
  if (elem.scrollHeight > minHeight) {
    if (maxHeight && elem.scrollHeight > maxHeight) {
      height = maxHeight - padding;
      style.overflowY = "auto";
    } else {
      height = elem.scrollHeight - padding;
      style.overflowY = "hidden";
    }
    style.height = height + extra + "px";
    scrollTop += parseInt(style.height) - elem.currHeight;
    scrollElement.scrollTop = scrollTop;
    elem.currHeight = parseInt(style.height);
  }
}
