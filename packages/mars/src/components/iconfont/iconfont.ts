/*
 * @Author: Just be free
 * @Date:   2020-01-15 17:20:36
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-02-22 18:22:15
 */
import Vue, { CreateElement } from "vue";
import { Component, Prop } from "vue-property-decorator";
import { AnyObject } from "@/types";
import { warn, error } from "../modules/error";
import svgs from "./svgs";
import "./style/index.scss";
@Component({
  name: "Iconfont"
})
export default class Iconfont extends Vue {
  static componentName = "YnIconfont";
  static svgPrefix = "";
  static svgs: AnyObject = svgs;
  static extendData(options: AnyObject) {
    const { svgs, svgPrefix = "" } = options;
    Iconfont.svgs = { ...Iconfont.svgs, ...svgs };
    Iconfont.svgPrefix = svgPrefix;
  }
  @Prop({
    type: String
  })
  name!: string;
  @Prop({
    type: [String, Number],
    default: 28
  })
  size!: string | number;
  @Prop({
    type: Number,
    default: 0
  })
  rotate!: number;

  handleClick() {
    const { name } = this.$props;
    this.$emit("click", { name });
  }
  getSvg() {
    const { name } = this.$props;
    const reg = new RegExp(`^${Iconfont.svgPrefix}`);
    const iconName = name.replace(reg, "");
    if (Iconfont.svgs) {
      if (name.startsWith(Iconfont.svgPrefix) && Iconfont.svgs[iconName]) {
        return Iconfont.svgs[iconName];
      }
      if (Iconfont.svgs[name]) {
        return Iconfont.svgs[name];
      }
      warn(`${iconName}.svg is missing`);
    } else {
      error(
        `You need config svgs' lib before use ${this.$options.name} component`
      );
    }
  }
  render(h: CreateElement) {
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
            style: { transform: `rotate(${this.rotate}deg)` },
            attrs: { src: this.getSvg(), iconname: this.name },
            class: ["yn-iconfont", `yn-iconfont-size-${this.size}`],
          },
          []
        ),
      ]
    );
  }
}
