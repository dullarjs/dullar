/*
* @Author: Just be free
* @Date:   2021-01-20 09:54:38
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-07 18:33:42
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, Options } from "../component/Queen";
import { h } from "vue";
class Props {}
@Options({
  name: "QSubmitBarText"
})
export default class QSubmitBarText extends mixins(Queen).with(Props) {
  public static componentName = "QSubmitBarText";
  render() {
    return h("div", { class: ["q-submit-bar-text"] }, {
      default: () => this.getSlots()
    });
  }
}
