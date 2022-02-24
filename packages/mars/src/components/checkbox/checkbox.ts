/*
 * @Author: Just be free
 * @Date:   2020-01-16 12:49:59
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-02-23 11:46:05
 */
import Iconfont from "../iconfont";
import Vue, { CreateElement } from "vue";
import { Component, Prop } from "vue-property-decorator";
import "./style/index.scss";
@Component({
  name: "Checkbox",
  components: { Iconfont },
  model: {
    prop: "checked",
    event: "change",
  }
})
export default class Checkbox extends Vue{
  static componentName = "YnCheckbox";
  @Prop({
    type: Boolean,
    default: false
  })
  indeterminate!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  checked!: boolean;
  @Prop({
    type: [String, Number]
  })
  size!: string | number;
  @Prop({
    type: Boolean,
    default: false
  })
  disabled!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  disableClick!: boolean;
  get checkboxIconName() {
    let iconName = "";
    const disabled = this.disabled ? "-disabled" : "";
    if (this.indeterminate) {
      iconName = `checkbox-indeterminate${disabled}`;
    } else {
      iconName = this.checked ? `checkbox-checked${disabled}` : `checkbox-uncheck${disabled}`
    }
    return iconName;
  }
  handleClick() {
    if (!this.disabled && !this.disableClick) {
      this.$emit("change", !this.checked);
    }
  }
  render(h: CreateElement) {
    return h(
      "span",
      {
        class: ["yn-checkbox", this.disabled ? "disabled" : ""],
        on: { click: this.handleClick },
      },
      [
        h(
          "iconfont",
          {
            props: {
              size: this.size,
              name: this.checkboxIconName,
            }
          },
          []
        ),
      ]
    );
  }
}
