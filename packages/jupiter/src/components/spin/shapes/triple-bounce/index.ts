/*
 * @Author: Just be free
 * @Date:   2020-02-17 10:31:53
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-02-17 16:41:59
 */
import { h } from "vue";
import "./style.scss";
import common from "../common";
import { Vue, mixins, Options } from "vue-class-component";
import { AnyObject } from "@/types";
@Options({
  name: "TripleBounce"
})
export default class TripleBounce extends mixins(Vue, common) {
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
  render() {
    return h("div", { class: ["yn-spin-triple-bounce"] }, [
      h("div", { class: "triple-bounce1", style: this.bounceStyle }, []),
      h("div", { class: "triple-bounce2", style: this.bounceStyle }, []),
      h("div", { class: "triple-bounce3", style: this.bounceStyle }, []),
    ]);
  }
}
