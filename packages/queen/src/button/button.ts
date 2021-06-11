/*
* @Author: Just be free
* @Date:   2020-10-12 15:56:53
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-11 15:08:07
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import QIcon from "../icon";
import { h } from "vue";
class Props {
  size = prop<string>({ default: "default" })
  type = prop<string>({ default: "default" })
  disabled = prop<boolean>({ default: false })
  danger = prop<boolean>({ default: false })
  loading = prop<boolean>({ default: false })
  textHideWhenLoading = prop<boolean>({ default: false })
}
@Options({
  name: "QButton"
})
export default class QButton extends mixins(Queen).with(Props) {
  public static componentName = "QButton";
  validType(type: string): boolean {
    return ["default", "primary", "dashed"].indexOf(type) > -1;
  }
  validSize(size: string): boolean {
    return ["default", "large"].indexOf(size) > -1;
  }
  render() {
    const slots = this.getSlots();
    let className = [];
    if (this.validSize(this.size)) {
      className.push(this.size);
    }
    if (this.validType(this.type)) {
      className.push(`q-button-${this.type}`);
    }
    if (this.danger) {
      className.push("q-button-danger");
    }
    if (this.loading) {
      className.push("loading");
    }
    return h("button", { type: "button", class: ["q-button", ...className], disabled: this.disabled }, {
      default: () => [
        this.loading && (
          h(QIcon, { name: "loading", size: 16, adjustColor: true, class: ["q-button-loading"] }, { default: () => "" })
        ),
        (!this.textHideWhenLoading || this.textHideWhenLoading && !this.loading) && (
          h("span", {}, { default: () => slots })
        )
      ]
    });
  }
}