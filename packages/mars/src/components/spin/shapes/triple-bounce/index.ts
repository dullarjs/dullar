/*
 * @Author: Just be free
 * @Date:   2020-02-17 10:31:53
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-02-17 16:41:59
 */
import Vue, { CreateElement } from "vue";
import "./style.scss";
import common from "../common";
import { Mixins, Component } from "vue-property-decorator";
import { AnyObject } from "@/types";
@Component({
  name: "TripleBounce"
})
export default class TripleBounce extends Mixins(Vue, common) {
  get spinSize() {
    return (this.size || (this as AnyObject).$parent.size || 28) / 3 + "px";
  }
  get bounceStyle() {
    return {
      width: this.spinSize,
      height: this.spinSize,
      backgroundColor: this.spinColor,
    };
  }
  render(h: CreateElement) {
    return h("div", { class: ["yn-spin-triple-bounce"] }, [
      h("div", { class: "triple-bounce1", style: this.bounceStyle }, []),
      h("div", { class: "triple-bounce2", style: this.bounceStyle }, []),
      h("div", { class: "triple-bounce3", style: this.bounceStyle }, []),
    ]);
  }
}
