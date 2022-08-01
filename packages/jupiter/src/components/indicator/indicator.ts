/*
 * @Author: Just be free
 * @Date:   2020-02-18 10:24:33
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-06-16 10:22:59
 */
import "./style/index.scss";
import { h, Transition, withDirectives, vShow } from "vue";
import { Vue, Options, prop, mixins } from "vue-class-component";
import Spin from "../spin";
class Props {
  text!: string
  spinType!: string
  spinColor!: string
  background!: string
  size!: string | number
  lockScreen!: boolean
  transparent!: boolean
}
@Options({
  name: "Indicator",
  components: {
    Spin,
  }
})
export default class Indicator extends mixins(Vue).with(Props){
  static componentName = "YnIndicator";
  visible = false;
  render() {
    return h(Transition, { name: "yn-indicator" }, [
      withDirectives(h(
        "div",
        {
          class: ["yn-indicator"],
          // directives: [{ name: "show", value: this.visible }],
        },
        [
          h(
            "div",
            {
              class: [
                "yn-indicator-mask",
                this.transparent ? "transparent" : "",
              ],
            },
            []
          ),
          h(
            "div",
            {
              class: ["yn-indicator-wrapper"],
              style: {
                padding: this.text ? "20px" : "15px",
                background: this.background,
              },
            },
            [
              h(
                Spin,
                {
                  size: this.size,
                  type: this.spinType,
                  color: this.spinColor,
                  class: ["yn-indicator-spin"],
                },
                []
              ),
              withDirectives(h("span", {
                class: ["yn-indicator-text"],
                // directives: [{ name: "show", value: this.text }],
                domProps: { innerHTML: this.text },
              }), [[vShow, this.text]]),
            ]
          ),
        ]
      ), [[vShow, this.visible]])
    ]);
  }
}
