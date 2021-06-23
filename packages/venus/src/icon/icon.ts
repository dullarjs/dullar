/*
* @Author: Just be free
* @Date:   2020-09-23 16:16:46
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-23 14:24:05
* @E-mail: justbefree@126.com
*/
import Queen, { Options, mixins, prop } from "../component/Queen";
import Base642Svg from "../utils/dom/base642svg";
import { getPropertyValue } from "../utils/dom/style";
import { h } from "vue";
import svgs from "./svgs";
class Props {
  name!: string
  size = prop<string|number>({ default: 26 })
  cursor = prop<string>({ default: "auto" })
  adjustColor = prop<boolean>({ default: false })
}
@Options({
  name: "VIcon"
})
export default class VIcon extends mixins(Queen).with(Props) {
  public static componentName = "VIcon";
  public static svgs = svgs;
  public svgbase64 = VIcon.svgs[this.name as string];
  public static extend(options: typeof svgs) {
    VIcon.svgs = { ...VIcon.svgs, ...options };
  }
  adjustColorHandler(): void {
    if (this.adjustColor) {
      const color: string = getPropertyValue(this.$el.parentNode, "color");
      this.svgbase64 = Base642Svg.fill(this.svgbase64, color);
    }
  }
  mounted() {
    this.adjustColorHandler();
  }
  render() {
    let svgString = VIcon.svgs[this.name as string];
    if (this.adjustColor) {
      svgString = this.svgbase64;
    }
    return h("i", { class: ["v-iconfont-wrap", this.cursor] }, {
      default: () => [
        h("img", { src: svgString, class: ["v-iconfont", `v-iconfont-size-${this.size}`] }, { default: () => "" })
      ] 
    });
  }
}
