/*
 * @Author: Just be free
 * @Date:   2020-08-10 10:41:45
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-08-10 11:34:41
 * @E-mail: justbefree@126.com
 */

import "./style.less";
import common from "../common.js";
const svgIcon = require("./images/loading.svg");
export default {
  name: "rotate",
  mixins: [common],
  render(h) {
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
  },
};
