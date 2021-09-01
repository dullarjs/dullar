/*
 * @Author: Just be free
 * @Date:   2020-01-17 15:29:02
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-05-14 18:51:11
 * @E-mail: justbefree@126.com
 */

import { defineComponent } from "../modules/component";
import { renderedMixins } from "../mixins/rendered";
export default defineComponent({
  name: "Toast",
  mixins: [renderedMixins],
  props: {
    message: String,
  },
  data() {
    return {
      position: "middle",
      visible: false,
    };
  },
  methods: {
    setPosition(position = "bottom") {
      const validPosition = ["bottom", "middle"];
      if (validPosition.indexOf(position) > -1) {
        this.position = position;
      }
    },
  },
  render(h) {
    return h("transition", { props: { name: "yn-toast-pop" } }, [
      h(
        "div",
        {
          directives: [{ name: "show", value: this.visible }],
          class: ["yn-toast-container", `located-at-${this.position}`],
        },
        [h("span", { class: "toast-text" }, [this.message])]
      ),
    ]);
  },
});
