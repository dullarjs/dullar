/*
 * @Author: Just be free
 * @Date:   2020-02-17 16:28:49
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-02-17 16:44:52
 */

import "./style.scss";
import common from "../common";
import { h } from "vue";
import { Vue, Options, mixins } from "vue-class-component";
@Options({
  name: "DoubleBounce"
})
export default class DoubleBounce extends mixins(Vue, common){
  render() {
    return h(
      "div",
      {
        class: ["yn-spin-double-bounce"],
        style: { width: this.spinSize, height: this.spinSize },
      },
      [
        h(
          "div",
          {
            class: ["double-bounce-1"],
            style: { backgroundColor: this.spinColor },
          },
          []
        ),
        h(
          "div",
          {
            class: ["double-bounce-2"],
            style: { backgroundColor: this.spinColor },
          },
          []
        ),
      ]
    );
  }
}
