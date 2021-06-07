/*
* @Author: Just be free
* @Date:   2020-09-23 16:16:46
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-07 18:31:56
* @E-mail: justbefree@126.com
*/
import Queen, { Options, mixins, prop } from "../component/Queen";
import Base642Svg from "../utils/dom/base642svg";
import { getPropertyValue } from "../utils/dom/style";
import { h } from "vue";
import svgs from "./svgs";
console.log(svgs);
class Props {
  name!: string
  size = prop<string|number>({ default: 26 })
  cursor = prop<string>({ default: "auto" })
  adjustColor = prop<boolean>({ default: false })
}
@Options({
  name: "QIcon"
})
export default class QIcon extends mixins(Queen).with(Props) {
  public static componentName = "QIcon";
  public static svgs = svgs;
  public svgbase64 = QIcon.svgs[this.name as string];
  public static extend(options: typeof svgs) {
    QIcon.svgs = { ...QIcon.svgs, ...options };
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
    let svgString = QIcon.svgs[this.name as string];
    if (this.adjustColor) {
      svgString = this.svgbase64;
    }
    return h("i", { class: ["q-iconfont-wrap", this.cursor] }, {
      default: () => [
        h("img", { src: svgString, class: ["q-iconfont", `q-iconfont-size-${this.size}`] }, { default: () => "" })
      ] 
    });
  }
}
