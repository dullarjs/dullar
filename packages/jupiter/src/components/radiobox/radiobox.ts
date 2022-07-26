import Iconfont from "../iconfont";
import { h } from "vue";
import { Vue, Options, prop, mixins } from "vue-class-component";
import "./style/index.scss";
class Props {
  checked = prop<boolean>({ default: false })
  size!: string | number
  disabled = prop<boolean>({ default: false })
  disableClick = prop<boolean>({ default: false })
}
@Options({
  name: "Radiobox",
  components: {
    Iconfont,
  },
  model: {
    prop: "checked",
    event: "change",
  }
})
export default class Radiobox extends mixins(Vue).with(Props) {
  static componentName = "YnRadiobox";

  handleClick() {
    if (!this.disabled && !this.disableClick) {
      this.$emit("change", !this.checked);
    }
  }
  render() {
    const disabled = this.disabled ? "-disabled" : "";
    return h(
      "span",
      {
        class: ["yn-radiobox", this.disabled ? "disabled" : ""],
        on: { click: this.handleClick },
      },
      [
        h(
          Iconfont,
          {
            size: this.size,
            name: this.checked
              ? `radio-on${disabled}`
              : `radio-off${disabled}`
          },
          []
        ),
      ]
    );
  }
}
