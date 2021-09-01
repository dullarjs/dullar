/*
 * @Author: Just be free
 * @Date:   2020-02-17 10:31:53
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-02-17 16:41:59
 */
import "./style.less";
import common from "../common.js";
export default {
  name: "tripleBounce",
  mixins: [common],
  computed: {
    spinSize() {
      return (this.size || this.$parent.size || 28) / 3 + "px";
    },
    bounceStyle() {
      return {
        width: this.spinSize,
        height: this.spinSize,
        backgroundColor: this.spinColor,
      };
    },
  },
  render(h) {
    return h("div", { class: ["yn-spin-triple-bounce"] }, [
      h("div", { class: "triple-bounce1", style: this.bounceStyle }, []),
      h("div", { class: "triple-bounce2", style: this.bounceStyle }, []),
      h("div", { class: "triple-bounce3", style: this.bounceStyle }, []),
    ]);
  },
};
