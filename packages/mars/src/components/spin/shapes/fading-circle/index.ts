/*
 * @Author: Just be free
 * @Date:   2020-02-17 15:05:04
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-11-30 15:25:47
 */
import Vue, { CreateElement } from "vue";
import { Mixins, Component } from "vue-property-decorator";
import common from "../common";
import "./style.scss";
@Component({
  name: "FadingCircle"
})
export default class FadingCircle extends Mixins(Vue, common) {
  styleNode!: HTMLStyleElement;
  _uid!: string;
  createLeafNodes(h: CreateElement) {
    const nodes = [];
    for (let n = 0; n < 12; n++) {
      nodes.push(
        h("div", { class: [`is-circle-${n + 1}`, "fading-circle"] }, [])
      );
    }
    return nodes;
  }
  init() {
    this.styleNode = document.createElement("style");
    const css = `.circle-color-${this._uid} > div::before { background-color: ${this.spinColor}; }`;
    this.styleNode.type = "text/css";
    // this.styleNode.rel = "stylesheet";
    this.styleNode.title = "fading circle style";
    document.getElementsByTagName("head")[0].appendChild(this.styleNode);
    this.styleNode.appendChild(document.createTextNode(css));
  }
  destory() {
    if (this.styleNode) {
      this.styleNode.parentNode?.removeChild(this.styleNode);
    }
  }
  created() {
    this.init();
  }
  activated() {
    this.init();
  }
  beforeDestroy() {
    this.destory();
  }
  render(h: CreateElement) {
    return h(
      "div",
      {
        class: ["yn-spin-fading-circle", `circle-color-${this._uid}`],
        style: { height: this.spinSize, width: this.spinSize },
      },
      [this.createLeafNodes(h)]
    );
  }
}
