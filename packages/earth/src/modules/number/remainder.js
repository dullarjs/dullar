/*
 * @Author: Just be free
 * @Date:   2020-04-10 15:55:12
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-05-06 16:06:50
 * @E-mail: justbefree@126.com
 */
const getData = function (attr) {
  return this[attr];
};
const setData = function (attr, value) {
  this[attr] = value;
};
export class Remainder {
  constructor(r, i, context) {
    this.remainder = r;
    this.dir = 1;
    if (context && Object.prototype.hasOwnProperty.call(context, i)) {
      this.i = getData.call(context, i);
      this.attr = i;
      this.context = context;
      this.hasContext = true;
    } else {
      this.i = i || 0;
      this.hasContext = false;
    }
  }
  next(callback) {
    this.dir = 1;
    this.i = this.getNext("absolute");
    if (this.hasContext) {
      setData.call(this.context, this.attr, this.i);
    }
    callback && typeof callback === "function" && callback(this.i);
    return this;
  }
  previous(callback) {
    this.dir = -1;
    this.i = this.getPrevious("absolute");
    if (this.hasContext) {
      setData.call(this.context, this.attr, this.i);
    }
    callback && typeof callback === "function" && callback(this.i);
    return this;
  }
  getIndex() {
    return this.i;
  }
  getPrevious(pos) {
    let index = this.i;
    if (pos === "absolute") {
      index = (index - 1) % this.remainder;
      index = index >= 0 ? index : index + this.remainder;
    } else {
      if (this.dir > 0) {
        index = index === 0 ? this.remainder - 1 : index - 1;
      } else {
        index = (index + 1) % this.remainder;
      }
    }
    return index;
  }
  getNext(pos) {
    let index = this.i;
    if (pos === "absolute") {
      index = (index + 1) % this.remainder;
    } else {
      if (this.dir > 0) {
        index = (index + 1) % this.remainder;
      } else {
        index =
          index - 1 >= 0
            ? index - 1
            : (this.remainder + index) % this.remainder;
      }
    }
    return index;
  }
}
