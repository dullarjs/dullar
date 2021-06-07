/*
* @Author: Just be free
* @Date:   2020-10-23 11:32:56
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-07 16:29:38
* @E-mail: justbefree@126.com
*/
import { h, withDirectives, vShow, VNode, nextTick, Transition } from "vue";
import Queen, { mixins, prop, Options } from "../component/Queen";
import QSpin from "../spin";
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
  name: "QIndicator"
})
export default class QIndicator extends mixins(Queen).with(Props) {
  public static componentName = "QIndicator";
  public visible = false;
  setVisible(status: boolean): void {
    this.visible = status;
  }
  render() {
    return h(Transition, { name: "Q-indicator" }, {
      default: () => [
        withDirectives(h("div", { class: ["q-indicator"] }, {
          default: () => [
            h("div", { class: ["q-indicator-mask", this.transparent ? "transparent" : ""] }, {
              default: () => []
            }),
            h("div", {
                class: ["q-indicator-wrapper"],
                style: { padding: this.text ? "20px" : "15px", background: this.background }
              },
              {
                default: () => [
                  h(QSpin,
                    {
                      size: this.size, type: this.spinType, color: this.spinColor,
                      class: ["q-indicator-spin"]
                    },
                    { default: () => [] }
                  ),
                  withDirectives(h("span", {
                    class: ["q-indicator-text"],
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