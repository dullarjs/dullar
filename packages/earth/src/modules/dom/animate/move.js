/*
 * @Author: Just be free
 * @Date:   2020-04-10 13:33:50
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-10-11 13:48:30
 * @E-mail: justbefree@126.com
 */
import { Tween } from "./tween";
export const startMove = (obj, json, fn, div = 4) => {
  cancelAnimationFrame(obj.timer);
  let iCurrent = 0;
  let iSpeed = 0;
  obj.timer = requestAnimationFrame(() => {
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
      cancelAnimationFrame(obj.timer);
      fn && typeof fn === "function" && fn.call(obj);
    }
  });
};

export const move = (obj, json, fn) => {
  let t = 0,
    b = json.b,
    c = json.c,
    d = 40;
  let timer = null;
  cancelAnimationFrame(timer);
  const run = () => {
    const value = Math.ceil(Tween.Quart.easeOut(t, b, c, d));
    obj.style[json["attr"]] = `${value}px`;
    if (t < d) {
      t++;
      timer = requestAnimationFrame(run);
    } else {
      cancelAnimationFrame(timer);
      fn && typeof fn === "function" && fn.call(obj);
    }
  };
  run();
};
