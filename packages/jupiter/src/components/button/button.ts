/*
 * @Author: Just be free
 * @Date:   2020-01-15 17:15:58
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-02-25 15:17:19
 */
import "./style/index.scss";
import Spin from "../spin";
import Iconfont from "../iconfont";
import { h, Slot } from "vue";
import { Vue, Options, prop, mixins } from "vue-class-component";
class Props {
  type = prop<string>({ default: "default" })
  size = prop<string>({ default: "normal" })
  disabled = prop<boolean>({ default: false })
  plain = prop<boolean>({ default: false })
  text = prop<boolean>({ default: false })
  loading = prop<boolean>({ default: false })
  loadingText = prop<string>({ default: "" })
  loadingType = prop<string>({ default: "snake" })
  loadingSize = prop<number>({ default: 14 })
  loadingColor = prop<string>({ default: "#0052CC" })
  iconName = prop<string>({ default: "" })
  iconSize = prop<string>({ default: "16" })
  parse = prop<(city: string) => string>({
    default: (city: string) => {
      // if (!nameSpace) nameSpace = "";
      return `<span>${city}</span>`;
    }
  })
}
@Options({
  name: "Button",
  components: { Spin, Iconfont }
})
export default class Button extends mixins(Vue).with(Props) {
  static componentName = "YnButton";

  isValidType() {
    return ["primary", "warning", "danger", "text"].indexOf(this.type) > -1;
  }
  isValidSize() {
    return ["medium", "small", "mini"].indexOf(this.size) > -1;
  }
  createLoading() {
    const loading = [];
    if (this.loading) {
      loading.push(
        h("div", { class: ["yn-button__loading-icon"] }, [
          h(
            Spin,
            {
              props: {
                type: this.loadingType,
                size: this.loadingSize,
                color: this.loadingColor,
                borderWidth: 2,
              },
            },
            []
          ),
        ])
      );
    }
    return loading;
  }
  createIcon() {
    const icon = [];
    if (this.iconName) {
      icon.push(
        h(
          Iconfont,
          {
            "class": ["yn-button__icon"],
            name: this.iconName,
            size: this.iconSize
          },
          []
        )
      );
    }
    return icon;
  }
  handleClick() {
    if (!this.loading && !this.disabled) {
      this.$emit("click");
    }
  }
  render() {
    const className = [];
    if (this.isValidType()) {
      className.push(`yn-button--${this.type}`);
    } else {
      className.push(`yn-button--default`);
    }
    if (this.isValidSize()) {
      className.push(`yn-button--${this.size}`);
    }
    if (this.disabled) {
      className.push("is-disabled");
    }
    if (this.loading) {
      className.push("yn-button--loading");
    }
    if (this.plain) {
      className.push("is-plain");
    }
    // if (this.text) {
    //   className.push("is-text");
    // }
    const text =
      this.loading && (this.loadingText || this.loadingText === "")
        ? this.loadingText
        : (this.$slots.default as Slot)();
    return h(
      "button",
      {
        class: ["yn-button", ...className],
        type: "button",
        onClick: this.handleClick,
      },
      [
        ...this.createLoading(),
        ...this.createIcon(),
        h("span", { class: ["yn-button__text"] }, text),
      ]
    );
  }
}
