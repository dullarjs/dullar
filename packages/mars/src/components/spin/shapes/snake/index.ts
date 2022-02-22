/*
 * @Author: Just be free
 * @Date:   2020-02-14 17:08:59
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-12-25 17:10:52
 */
import Vue, { CreateElement } from "vue";
import "./style.scss";
import common from "../common";
import { Mixins, Component } from "vue-property-decorator";
@Component({
  name: "Snake"
})
export default class Sname extends Mixins(Vue, common) {
  render(h: CreateElement) {
    return h(
      "div",
      {
        class: ["yn-spin-snake"],
        style: {
          borderBottomColor: this.spinColor,
          borderLeftColor: this.spinColor,
          borderTopColor: this.spinColor,
          width: this.spinSize,
          height: this.spinSize,
          borderWidth: this.spinBorderWidth,
        },
      },
      []
    );
  }
}
