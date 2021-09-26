/*
 * @Author: Just be free
 * @Date:   2020-01-15 17:20:36
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-26 14:05:49
 */
import "./style/index.less";
import { defineComponent } from "../modules/component";
import { warn, error } from "../modules/error";
import svgs from "./svgs";
export default defineComponent({
  name: "Iconfont",
  props: {
    name: String,
    size: {
      type: [String, Number],
      default: 28,
      require: false,
    },
  },
  data() {
    return {
      svgPrefix: "",
      svgs,
    };
  },
  methods: {
    handleClick(e) {
      const { name } = this.$props;
      this.$emit("click", { e, name });
    },
    getSvg() {
      const { name } = this.$props;
      const reg = new RegExp(`^${this.svgPrefix}`);
      const iconName = name.replace(reg, "");
      if (this.svgs) {
        if (name.startsWith(this.svgPrefix) && this.svgs[iconName]) {
          return this.svgs[iconName];
        }
        if (this.svgs[name]) {
          return this.svgs[name];
        }
        warn(`${iconName}.svg is missing`);
      } else {
        error(
          `You need config svgs' lib before use ${this.$options.name} component`
        );
      }
    },
  },
  render(h) {
    return h(
      "i",
      {
        class: [
          "disable-highlight-tap",
          "yn-iconfont-wrap",
          String(this.size) === "0" ? "yn-iconfont-size-0" : "",
        ],
        on: { click: this.handleClick },
      },
      [
        h(
          "img",
          {
            attrs: { src: this.getSvg(), iconname: this.name },
            class: ["yn-iconfont", `yn-iconfont-size-${this.size}`],
          },
          []
        ),
      ]
    );
  },
});
