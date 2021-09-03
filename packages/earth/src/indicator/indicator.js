/*
 * @Author: Just be free
 * @Date:   2020-02-18 10:24:33
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-06-16 10:22:59
 */

import { defineComponent, genComponentName } from "../modules/component";
import { renderedMixins } from "../mixins/rendered";
import Spin from "../spin";
export default defineComponent({
  name: "Indicator",
  mixins: [renderedMixins],
  props: {
    text: String,
    spinType: String,
    spinColor: String,
    background: String,
    size: [Number, String],
    lockScreen: Boolean,
    transparent: Boolean,
  },
  components: {
    Spin,
  },
  data() {
    return {
      visible: false,
    };
  },
  render(h) {
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
                genComponentName("spin"),
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
  },
});
