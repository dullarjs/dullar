/*
 * @Author: Just be free
 * @Date:   2020-01-16 12:49:59
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-02-23 11:46:05
 */
import Iconfont from "../iconfont";
import { h } from "vue";
import { Vue, Options, prop, mixins } from "vue-class-component";
import "./style/index.scss";
class Props {
  indeterminate = prop<boolean>({ default: false })
  modelValue = prop<boolean>({ default: false })
  size!: string | number
  disabled = prop<boolean>({ default: false })
  disableClick = prop<boolean>({ default: false })
}
@Options({
  name: "Checkbox",
  components: { Iconfont },
  emits: ["update:modelValue"]
})
export default class Checkbox extends mixins(Vue).with(Props){
  static componentName = "YnCheckbox";
  get checkboxIconName() {
    let iconName = "";
    const disabled = this.disabled ? "-disabled" : "";
    if (this.indeterminate) {
      iconName = `checkbox-indeterminate${disabled}`;
    } else {
      iconName = this.modelValue ? `checkbox-checked${disabled}` : `checkbox-uncheck${disabled}`
    }
    return iconName;
  }
  handleClick() {
    if (!this.disabled && !this.disableClick) {
      this.$emit("update:modelValue", !this.modelValue);
    }
  }
  render() {
    return h(
      "span",
      {
        class: ["yn-checkbox", this.disabled ? "disabled" : ""],
        onClick: this.handleClick
      },
      [
        h(
          Iconfont,
          {
            size: this.size,
            name: this.checkboxIconName,
          },
          []
        ),
      ]
    );
  }
}
