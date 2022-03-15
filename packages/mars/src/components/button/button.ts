/*
 * @Author: Just be free
 * @Date:   2020-01-15 17:15:58
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-02-25 15:17:19
 */
import "./style/index.scss";
import Spin from "../spin";
import Iconfont from "../iconfont";
import Vue, { CreateElement } from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({
  name: "Button",
  components: { Spin, Iconfont }
})
export default class Button extends Vue {
  static componentName = "YnButton";

  @Prop({
    type: String,
    default: "default"
  })
  type!: string;
  @Prop({
    type: String,
    default: "normal"
  })
  size!: string;
  @Prop({
    type: Boolean,
    default: false
  })
  disabled!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  plain!: boolean;
  @Prop({
    type: Boolean,
    default: false
  })
  text!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  loading!: boolean;
  @Prop({
    type: String
  })
  loadingText!: string;
  @Prop({
    type: String,
    default: "snake",
  })
  loadingType!: string;
  @Prop({
    type: Number,
    default: 14,
  })
  loadingSize!: number;
  @Prop({
    type: String,
    default: "#0052CC",
  })
  loadingColor!: string;
  @Prop({
    type: String
  })
  iconName!: string;
  @Prop({
    type: String,
    default: "16",
  })
  iconSize!: string;

  isValidType() {
    return ["primary", "warning", "danger", "text"].indexOf(this.type) > -1;
  }
  isValidSize() {
    return ["medium", "small", "mini"].indexOf(this.size) > -1;
  }
  createLoading(h: CreateElement) {
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
  createIcon(h: CreateElement) {
    const icon = [];
    if (this.iconName) {
      icon.push(
        h(
          Iconfont,
          {
            "class": ["yn-button__icon"],
            props: { name: this.iconName, size: this.iconSize }
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
  render(h: CreateElement) {
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
        : this.$slots.default;
    return h(
      "button",
      {
        class: ["yn-button", ...className],
        attrs: { type: "button" },
        on: { click: this.handleClick },
      },
      [
        ...this.createLoading(h),
        ...this.createIcon(h),
        h("span", { class: ["yn-button__text"] }, text),
      ]
    );
  }
}
