/*
* @Author: Just be free
* @Date:   2020-11-30 13:42:13
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-07 18:33:31
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, Options } from "../component/Queen";
import { h } from "vue";
class Props {}
@Options({
  name: "QSubmitBarPopupContent"
})
export default class QSubmitBarPopupContent extends mixins(Queen).with(Props) {
  public static componentName = "QSubmitBarPopupContent";
  render() {
    return h("div", { class: ["q-submit-action-popup-content"] }, {
      default: () => [this.getSlots()]
    });
  }
}
