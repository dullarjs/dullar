/*
 * @Author: yegl
 * @Date: 2021-12-06 04:04:54
 * @Last Modified by: yegl
 * @Last Modified time: 2021-12-06 06:26:47
 * @E-mail: yglgzyx@126.com
 */
import { defineComponent } from "../modules/component";
export default defineComponent({
  name: "Switch",
  props: {
    value: {
      type: Boolean | String | Number,
      default: true,
    },
    activeColor: {
      type: String,
      default: "",
    },
    inactiveColor: {
      type: String,
      default: "",
    },
    width: {
      type: String | Number,
      default: 40,
    },
    activeValue: {
      type: Boolean | String | Number,
      default: true,
    },
    inactiveValue: {
      type: Boolean | String | Number,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      newBgColor: "",
      needChangeBgColor: false,
    };
  },
  computed: {
    isChecked() {
      return this.value === this.activeValue;
    },
    switchDisabled() {
      return this.disabled;
    },
  },
  mounted() {
    if (this.activeColor || this.inactiveColor) {
      this.needChangeBgColor = true;
      this.setBackgroundColor();
    }
  },
  methods: {
    handleChange() {
      if (this.switchDisabled) return;
      const val = this.isChecked ? this.inactiveValue : this.activeValue;
      this.newBgColor = this.isChecked ? this.inactiveColor : this.activeColor;
      this.$emit("input", val);
    },
    setBackgroundColor() {
      this.newBgColor = this.isChecked ? this.activeColor : this.inactiveColor;
    },
  },
  render(h) {
    const { isChecked, switchDisabled, width, newBgColor } = this;
    return h(
      "div",
      { class: { "yn-switch": true, "yn-switch-checked": isChecked } },
      [
        h(
          "span",
          {
            class: ["yn-switch-main", switchDisabled ? "switch-disabled" : ""],
            style: { width: width + "px", backgroundColor: newBgColor },
            on: { click: () => this.handleChange() },
          },
          []
        ),
      ]
    );
  },
});
