/*
* @Author: Just be free
* @Date:   2020-11-30 14:30:08
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-07 18:33:53
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, Options } from "../component/Queen";
import { h } from "vue";
class Props {}
@Options({
  name: "QSubmitBarValue"
})
export default class QSubmitBarValue extends mixins(Queen).with(Props) {
  public static componentName = "QSubmitBarValue";
  render() {
    return h("div", { class: ["q-submit-action-value"] }, { default: () => [this.getSlots()] });
  }
}
