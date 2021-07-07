/*
* @Author: Just be free
* @Date:   2020-11-19 17:56:43
* @Last Modified by:   Just be free
* @Last Modified time: 2021-07-07 16:03:46
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import { h } from "vue";

class Props {
  height?: string|number
}
@Options({
  name: "QAnimationListItem",
})
export default class QAnimationListItem extends mixins(Queen).with(Props) {
  public static componentName = "QAnimationListItem";
  render() {
    return h("div", { class: ["q-animation-list-item"], style: { height: `${this.height}px` } }, {
      default: () => [this.getSlots()]
    });
  }
}
