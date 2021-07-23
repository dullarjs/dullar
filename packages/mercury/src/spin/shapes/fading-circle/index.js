/*
 * @Author: Just be free
 * @Date:   2020-02-17 15:05:04
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-03-26 10:51:23
 */
import common from "../common.js";
import "./style.less";
export default {
  name: "fadingCircle",
  mixins: [common],
  methods: {
    createLeafNodes(h) {
      const nodes = [];
      for (let n = 0; n < 12; n++) {
        nodes.push(
          h("div", { class: [`is-circle-${n + 1}`, "fading-circle"] }, [])
        );
      }
      return nodes;
    },
  },
  created() {
    this.styleNode = document.createElement("style");
    const css = `.circle-color-${this._uid} > div::before { background-color: ${this.spinColor}; }`;
    this.styleNode.type = "text/css";
    this.styleNode.rel = "stylesheet";
    this.styleNode.title = "fading circle style";
    document.getElementsByTagName("head")[0].appendChild(this.styleNode);
    this.styleNode.appendChild(document.createTextNode(css));
  },
  beforeDestroy() {
    if (this.styleNode) {
      this.styleNode.parentNode.removeChild(this.styleNode);
    }
  },
  render(h) {
    return h(
      "div",
      {
        class: ["yn-spin-fading-circle", `circle-color-${this._uid}`],
        style: { height: this.spinSize, width: this.spinSize },
      },
      [this.createLeafNodes(h)]
    );
  },
};
