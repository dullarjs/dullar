/*
 * @Author: Just be free
 * @Date:   2020-02-18 10:24:33
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-06-16 10:22:59
 */
import "./style/index.scss";
import Vue, { CreateElement } from "vue";
import { Mixins, Component, Prop } from "vue-property-decorator";
import { renderedMixins } from "../mixins/rendered";
import Spin from "../spin";
@Component({
  name: "Indicator",
  components: {
    Spin,
  }
})
export default class Indicator extends Mixins(Vue, renderedMixins){
  static componentName = "YnIndicator";
  visible = false;
  @Prop({
    type: String
  })
  text!: string;
  @Prop({
    type: String,
  })
  spinType!: string;
  @Prop({
    type: String,
  })
  spinColor!: string;
  @Prop({
    type: String,
  })
  background!: string;
  @Prop({
    type: [Number, String],
  })
  size!: string | number;
  @Prop({
    type: Boolean
  })
  lockScreen!: boolean;
  @Prop({
    type: Boolean
  })
  transparent!: boolean;
  render(h: CreateElement) {
    return h("transition", { props: { name: "yn-indicator" } }, [
      h(
        "div",
        {
          class: ["yn-indicator"],
          directives: [{ name: "show", value: this.visible }],
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
                "spin",
                {
                  props: {
                    size: this.size,
                    type: this.spinType,
                    color: this.spinColor,
                  },
                  class: ["yn-indicator-spin"],
                },
                []
              ),
              h("span", {
                class: ["yn-indicator-text"],
                directives: [{ name: "show", value: this.text }],
                domProps: { innerHTML: this.text },
              }),
            ]
          ),
        ]
      ),
    ]);
  }
}
