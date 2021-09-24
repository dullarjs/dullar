/*
 * @Author: Just be free
 * @Date:   2020-01-16 12:49:59
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-24 18:30:08
 */
import "./style/index";
import Iconfont from "../iconfont";
import { defineComponent, genComponentName } from "../modules/component";
export default defineComponent({
  name: "Checkbox",
  components: { Iconfont },
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
    indeterminate: {
      default: false,
      type: Boolean,
    },
  },
  model: {
    prop: "checked",
    event: "change",
  },
  methods: {
    handleClick() {
      if (!this.disabled && !this.disableClick) {
        this.$emit("change", !this.checked);
      }
    },
  },
  computed: {
    iconfontName() {
      const disabled = !this.indeterminate && this.disabled ? "-disabled" : "";
      if (this.indeterminate) {
        return "indeterminate";
      }
      return this.checked
        ? `checkbox-checked${disabled}`
        : `checkbox-uncheck${disabled}`;
    },
  },
  render(h) {
    return h(
      "span",
      {
        class: ["yn-checkbox", this.disabled ? "disabled" : ""],
        on: { click: this.handleClick },
      },
      [
        h(
          genComponentName("iconfont"),
          {
            props: {
              size: this.size,
              name: this.iconfontName,
            },
          },
          []
        ),
      ]
    );
  },
});
