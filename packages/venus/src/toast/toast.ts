/*
* @Author: Just be free
* @Date:   2020-09-23 16:16:46
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-23 14:42:08
* @E-mail: justbefree@126.com
*/
import Queen, { Options, mixins, prop } from "../component/Queen";
import { Transition, h, withDirectives, vShow } from "vue";
class Props {
  message!: string
  position = prop<string>({
    default: "middle",
    validator: function(value: string): boolean {
      return ["bottom", "middle", "top"].indexOf(value) !== -1;
    }
  })
}
@Options({
  name: "VToast"
})
export default class VToast extends mixins(Queen).with(Props) {
  public static componentName = "VToast";
  public visible = false;
  public closed = false;
  public timer = 0;
  setVisiable(v: boolean): void {
    this.visible = v;
  }
  setClosed(c: boolean): void {
    this.closed = c;
  }
  close(callback?: () => void): void {
    this.closed = true;
    this.visible = false;
    callback && (typeof callback === "function") && callback();
  }
  render() {
    return h(Transition, { name: "v-toast-pop" }, { default: () => [
      withDirectives(h(
        "div",
        {
          class: ["v-toast-container", `located-at-${this.position}`]
        },
        {
          default: () => [h("span", { class: "toast-text" }, { default: () => this.message })]
        }
      ), [[vShow, this.visible]])
    ] });
  }
}
