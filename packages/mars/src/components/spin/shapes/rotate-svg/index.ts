/*
 * @Author: Just be free
 * @Date:   2020-08-10 10:41:45
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-08-10 11:34:41
 * @E-mail: justbefree@126.com
 */
import Vue, { CreateElement } from "vue";
import "./style.scss";
import common from "../common";
import { Mixins, Component } from "vue-property-decorator";
const svgIcon = require("./images/loading.svg");
@Component({
  name: "rotateSvg"
})
export default class rotateSvg extends Mixins(Vue, common) {
  render(h: CreateElement) {
    return h(
      "div",
      {
        class: ["yn-spin-rotate-svg"],
        style: {
          borderBottomColor: this.spinColor,
          borderLeftColor: this.spinColor,
          borderTopColor: this.spinColor,
          width: this.spinSize,
          height: this.spinSize,
        },
      },
      [h("img", { attrs: { src: svgIcon } }, [])]
    );
  }
}
