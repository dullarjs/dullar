/*
 * @Author: Just be free
 * @Date:   2020-02-14 17:47:57
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-12-25 17:10:19
 */

import { AnyObject } from "@/types";
import { Vue, Options, prop, mixins } from "vue-class-component";
class Props {
  size!: string | number;
  color!: string;
  borderWidth!: string | number;
}
@Options({
  name: "ShapeCommon"
})
export default class ShapeCommon extends mixins(Vue).with(Props) {
  get spinColor() {
    return this.color || (this as AnyObject).$parent.color || "#ccc";
  }
  get spinSize() {
    return (this.size || (this as AnyObject).$parent.size || 28) + "px";
  }
  get spinBorderWidth() {
    return (this.borderWidth || (this as AnyObject).$parent.borderWidth || 4) + "px";
  }
}
