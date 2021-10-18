/*
 * @Author: Just be free
 * @Date:   2020-04-10 13:33:50
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-10-18 12:04:05
 * @E-mail: justbefree@126.com
 */

import { Tween } from "./tween";
import { hasOwnProperty } from "../../utils";
export const startMove = (obj, json, fn, div = 4) => {
  clearInterval(obj.timer);
  let iCurrent = 0;
  let iSpeed = 0;
  obj.timer = setInterval(() => {
    let finished = true;
    for (let attr in json) {
      let iTarget = json[attr];
      if (attr === "opacity") {
        iCurrent = Math.round(getComputedStyle(obj, false)["opacity"] * 100);
      } else {
        iCurrent = parseInt(getComputedStyle(obj, false)[attr]);
      }
      iSpeed = (iTarget - iCurrent) / div;
      iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
      if (iCurrent !== iTarget) {
        finished = false;
        if (attr === "opacity") {
          obj.style.opacity = (iCurrent + iSpeed) / 100;
        } else {
          obj.style[attr] = `${iCurrent + iSpeed}px`;
        }
      }
    }
    if (finished) {
      clearInterval(obj.timer);
      fn && typeof fn === "function" && fn.call(obj);
    }
  }, 30);
};

export const move = (obj, json, fn) => {
  let attr = hasOwnProperty(json, "left") ? "left" : "top";
  let t = 0,
    b = 0,
    c = json[attr],
    d = 40;
  let timer = null;
  clearTimeout(timer);
  b = parseInt(getComputedStyle(obj, false)[attr]);
  const run = () => {
    const value = Math.ceil(Tween.Quart.easeOut(t, b, c, d));
    obj.style[attr] = `${value}px`;
    if (t < d) {
      t++;
      timer = setTimeout(run, 10);
    } else {
      clearTimeout(timer);
      fn && typeof fn === "function" && fn.call(obj);
    }
  };
  run();
};
