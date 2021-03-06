/*
 * @Author: Just be free
 * @Date:   2020-08-10 10:41:45
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-08-10 11:34:41
 * @E-mail: justbefree@126.com
 */
import { h } from "vue";
import "./style.scss";
import common from "../common";
import { Vue, mixins, Options } from "vue-class-component";
const svgIcon = require("./images/loading.svg");
@Options({
  name: "RotateSvg"
})
export default class RotateSvg extends mixins(Vue, common) {
  render() {
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
