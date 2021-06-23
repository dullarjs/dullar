/*
* @Author: Just be free
* @Date:   2020-10-12 15:56:53
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-23 14:04:23
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import VIcon from "../icon";
import { h } from "vue";
class Props {
  size = prop<string>({ default: "middle" })
  type = prop<string>({ default: "default" })
  disabled = prop<boolean>({ default: false })
  loading = prop<boolean>({ default: false })
  textHideWhenLoading = prop<boolean>({ default: false })
}
@Options({
  name: "VButton"
})
export default class VButton extends mixins(Queen).with(Props) {
  public static componentName = "VButton";
  validType(type: string): boolean {
    return ["default", "primary"].includes(type);
  }
  validSize(size: string): boolean {
    return ["default", "large", "small", "middle"].includes(size);
  }
  render() {
    const slots = this.getSlots();
    let className = [];
    if (this.validSize(this.size)) {
      className.push(this.size);
    }
    if (this.validType(this.type)) {
      className.push(`v-button-${this.type}`);
    }
    if (this.loading) {
      className.push("loading");
    }
    return h("button", { type: "button", class: ["v-button", ...className], disabled: this.disabled }, {
      default: () => [
        this.loading && (
          h(VIcon, { name: "loading", size: 16, adjustColor: true, class: ["v-button-loading"] }, { default: () => "" })
        ),
        (!this.textHideWhenLoading || this.textHideWhenLoading && !this.loading) && (
          h("span", {}, { default: () => slots })
        )
      ]
    });
  }
}