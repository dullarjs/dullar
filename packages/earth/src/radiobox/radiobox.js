/*
 * @Author: Just be free
 * @Date:   2020-01-16 12:51:20
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-08-16 15:07:50
 */
import { defineComponent, genComponentName } from "../modules/component";
import Iconfont from "../iconfont";
export default defineComponent({
  name: "Radiobox",
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    size: [String, Number],
    disabled: {
      type: Boolean,
      default: false,
    },
    disableClick: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: "checked",
    event: "change",
  },
  components: {
    Iconfont,
  },
  methods: {
    handleClick() {
      if (!this.disabled && !this.disableClick) {
        this.$emit("change", !this.checked);
      }
    },
  },
  render(h) {
    const disabled = this.disabled ? "-disabled" : "";
    return h(
      "span",
      {
        class: ["yn-radiobox", this.disabled ? "disabled" : ""],
        on: { click: this.handleClick },
      },
      [
        h(
          genComponentName("iconfont"),
          {
            props: {
              size: this.size,
              name: this.checked
                ? `radio-on${disabled}`
                : `radio-off${disabled}`,
            },
          },
          []
        ),
      ]
    );
  },
});
