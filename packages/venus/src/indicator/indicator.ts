/*
* @Author: Just be free
* @Date:   2020-10-23 11:32:56
* @Last Modified by:   Just be free
* @Last Modified time: 2022-07-19 16:46:30
* @E-mail: justbefree@126.com
*/
import { h, withDirectives, vShow, VNode, nextTick, Transition } from "vue";
import Venus, { mixins, prop, Options } from "../component/Venus";
import VSpin from "../spin";
class Props {
  text?: string
  spinType?: string
  spinColor?: string
  background?: string
  size?: string|number
  lockScreen?: boolean
  transparent?: boolean
}
@Options({
  name: "VIndicator"
})
export default class VIndicator extends mixins(Venus).with(Props) {
  public static componentName = "VIndicator";
  public visible = false;
  setVisible(status: boolean): void {
    this.visible = status;
  }
  render() {
    return h(Transition, { name: "v-indicator" }, {
      default: () => [
        withDirectives(h("div", { class: ["v-indicator"] }, {
          default: () => [
            h("div", { class: ["v-indicator-mask", this.transparent ? "transparent" : ""] }, {
              default: () => []
            }),
            h("div", {
                class: ["v-indicator-wrapper"],
                style: { padding: this.text ? "20px" : "15px", background: this.background }
              },
              {
                default: () => [
                  h(VSpin,
                    {
                      size: this.size, type: this.spinType, color: this.spinColor,
                      class: ["v-indicator-spin"]
                    },
                    { default: () => [] }
                  ),
                  withDirectives(h("span", {
                    class: ["v-indicator-text"],
                    innerHTML: this.text
                  }), [[vShow, this.text]])
                ]
              }
            )
          ]
        }), [[vShow, this.visible]])
      ]
    });
  }
}