/*
 * @Author: Just be free
 * @Date:   2020-05-28 11:43:13
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-07-02 17:30:33
 * @E-mail: justbefree@126.com
 */
import "./style.less";
import common from "../common.js";
export default {
  name: "rotate",
  mixins: [common],
  methods: {
    createLeafNodes(h) {
      const nodes = [];
      for (let n = 0; n < 5; n++) {
        nodes.push(
          h("div", { class: [`rotate-leaf-${n + 1}`, "rotate-leaf"] }, [])
        );
      }
      return h("div", { class: ["rotate-leaf-wapper"] }, nodes);
    },
  },
  render(h) {
    return h(
      "div",
      {
        class: ["yn-spin-rotate"],
        style: {
          borderBottomColor: this.spinColor,
          borderLeftColor: this.spinColor,
          borderTopColor: this.spinColor,
          width: "50px",
          height: "50px",
        },
      },
      [this.createLeafNodes(h)]
    );
  },
};
