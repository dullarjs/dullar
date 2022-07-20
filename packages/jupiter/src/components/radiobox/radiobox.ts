import Iconfont from "../iconfont";
import Vue, { CreateElement } from "vue";
import { Vue, Options, Prop } from "vue-class-component";
import "./style/index.scss";
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
export default class Radiobox extends Vue {
  static componentName = "YnRadiobox";
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

  handleClick() {
    if (!this.disabled && !this.disableClick) {
      this.$emit("change", !this.checked);
    }
  }
  render(h: CreateElement) {
    const disabled = this.disabled ? "-disabled" : "";
    return h(
      "span",
      {
        class: ["yn-radiobox", this.disabled ? "disabled" : ""],
        on: { click: this.handleClick },
      },
      [
        h(
          "iconfont",
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
  }
}
