/*
* @Author: Just be free
* @Date:   2020-11-10 10:45:01
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-07 18:37:11
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, Options } from "../component/Queen";
import { h, withDirectives, vShow } from "vue";
class Props {
  title?: string
  disabled?: boolean
  name!: string
}
@Options({
  name: "QTabItem",
  emits: [],
  inject: ["parentTab"]
})
export default class QTabItem extends mixins(Queen).with(Props) {
  public static componentName = "QTabItem";
  render() {
    const { currentTab } = this.parentTab;
    return withDirectives(h(
      "div",
      {
        class: ["q-tab-item-content"],
      },
      { default: () => this.getSlots() }
    ), [[vShow, currentTab === this.name]]);
  }
}
