/*
 * @Author: Just be free
 * @Date:   2020-01-16 15:50:12
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-10-22 10:41:32
 */

import "./style/index.scss";
import { h, VNode } from "vue";
import { Vue, Options, prop, mixins } from "vue-class-component";
import { encrypt } from "@/utils";
import { slotsMixins } from "../mixins/slots";
import Iconfont from "../iconfont";
import { AnyObject } from "@/types";
const VALID_TYPE = ["number", "textarea", "password", "text", "email", "tel"];
class Props {
  size = prop<string>({ default: "medium" })
  labelWidth!: string
  value = prop<number | string>({ default: "" })
  label = prop<string>({ default: "" })
  placeholder = prop<string>({ default: "" })
  maxlength!: number | string
  readonly = prop<boolean>({ default: false })
  autofocus = prop<boolean>({ default: false })
  required = prop<boolean>({ default: false })
  disabled = prop<boolean>({ default: false })
  clearable = prop<boolean>({ default: false })
  interactive = prop<string>({ default: "address" })
  type = prop<string>({ default: "text"})
  iconName!: string
  showTextareaCounter = prop<boolean>({ default: false })
  encrypted = prop<boolean>({ default: false })
  display = prop<string>({ default: "row" })
  pattern!: string
  encrypt = prop<(v: string|number) => string>({
    default: () => {
      return encrypt
    }
  })
  iconClass = prop<string[]>({ default: [] })
  iconSize = prop<number>({ default: 16 })
  iconRotate = prop<number>({ default: 0 })
  noBorder = prop<boolean>({ default: false })
  inputWidth = prop<string>({ default: "100%" })
}
@Options({
  name: "Field",
  components: { Iconfont }
})
export default class Field extends mixins(Vue, slotsMixins).with(Props){
  static componentName = "YnField";
  target!: HTMLInputElement;
  showIcon = false;
  showEncryptInput = false;
  inputing = false;
  originalText: string | number = "";

  get valueComputed() {
    return this.encrypted && !this.inputing
          ? this.encrypt(this.value)
          : this.value
  }
  get maxLengthComputed() {
    return this.maxlength ? Number(this.maxlength) : null;
  }
  get iconNameComputed() {
    return this.clearable ? "clear" : this.iconName;
  }
  initPropsToData() {
    return [{ key: "originalText", value: "value" }];
  }

  focus() {
    this.getInput().focus();
  }
  blur() {
    this.getInput().blur();
  }
  getInput() {
    return (this.$refs.input as HTMLInputElement) || (this.$refs.textarea as HTMLTextAreaElement);
  }
  handleOnFocus(e: Event) {
    this.target = (e.target as HTMLInputElement);
    this.$emit("focus", e);
    this.$emit("click", e);
    if (this.encrypted) {
      (e.target as HTMLInputElement).value = "";
      this.$emit("input", "");
    }
  }
  handleOnBlur(e: Event) {
    this.inputing = false;
    if (this.encrypted) {
      if (this.value === "") {
        // this.$emit("input", this.encrypt(this.originalText));
        this.$emit("input", this.originalText);
      } else {
        this.originalText = (e.target as HTMLInputElement).value;
        // this.$emit("input", this.encrypt(e.target.value));
      }
    }
    this.$emit("blur", e);
  }
  handleInput(e: Event) {
    if (this.clearable && (e.target as HTMLInputElement).value) {
      this.showIcon = true;
    } else {
      this.showIcon = false;
    }
    this.inputing = true;
    this.$emit("input", (e.target as HTMLInputElement).value);
  }
  handleIconClick() {
    if (this.clearable) {
      this.target.value = "";
      this.$emit("input", "");
      this.showIcon = false;
      return false;
    }
  }
  createInput() {
    const maxlength = this.maxlength ? Number(this.maxlength) : null;
    const area = [];
    const attrs = {
      readonly: this.readonly,
      placeholder: this.placeholder,
      autofocus: this.autofocus,
      value:
        this.encrypted && !this.inputing
          ? this.encrypt(this.value)
          : this.value,
      required: this.required,
      disabled: this.disabled,
      maxlength,
      pattern: this.pattern,
    };
    const domProps = {
      value:
        this.encrypted && !this.inputing
          ? this.encrypt(this.value)
          : this.value,
    };
    const events = {
      onFocus: this.handleOnFocus,
      onBlur: this.handleOnBlur,
      onInput: this.handleInput,
    };
    const className = [];
    if (this.disabled) {
      className.push("disable");
    }
    if (this.noBorder) {
      className.push("is-noborder");
    }
    if (VALID_TYPE.indexOf(this.type) > -1) {
      if (this.type === "textarea") {
        area.push(
          h(
            "div",
            { class: ["yn-field-textarea"] },
            [
              h(
                "textarea",
                {
                  ref: "textarea",
                  class: ["textarea-ele", ...className],
                  ...events,
                  ...attrs,
                  domProps
                },
                []
              ),
              h(
                "div",
                {
                  directives: [
                    { name: "show", value: this.showTextareaCounter },
                  ],
                  class: ["yn-field-textarea-counter"],
                },
                [h("span", {}, `${(this.value as string).length}/${this.maxlength}`)]
              ),
            ]
          )
        );
      } else {
        area.push(
          h(
            "div",
            { class: ["yn-field-input"] },
            [
              h(
                "input",
                {
                  ref: "input",
                  ...events,
                  class: ["input-ele", ...className],
                  ...attrs,
                  type: this.type,
                  domProps
                },
                []
              ),
            ]
          )
        );
      }
    }
    return area;
  }
  createIcon() {
    const icon = [];
    const name = this.clearable ? "clear" : this.iconName;
    const directives = this.clearable
      ? [{ name: "show", value: this.showIcon }]
      : [];
    if (this.clearable || this.iconName) {
      icon.push(
        h(
          "div",
          {
            class: ["yn-field__suffix"],
            directives,
            onClick: this.handleIconClick
          },
          [
            h(
              Iconfont,
              {
                name,
                size: this.iconSize,
                rotate: this.iconRotate,
                "class": this.iconClass
              },
              []
            ),
          ]
        )
      );
    }
    return icon;
  }
  genLabel(label: VNode[] | string) {
    const style: AnyObject = {};
    if (this.labelWidth) {
      style.width = this.labelWidth
    }
    return h(("span"),
      { class: ["yn-field-label"], style },
      label
    );
  }
  render() {
    const slots = this.slots("label");
    const label = [];
    if (slots && Array.isArray(slots) && slots.length > 0) {
      label.push(this.genLabel(slots));
    } else if (this.label) {
      label.push(this.genLabel(this.label));
    }
    const ynFieldClassName = [
      "yn-field-container",
      this.clearable || this.iconName ? "yn-field--suffix" : ""
    ];
    const style = {
      width: this.inputWidth
    };
    return h("div", { class: ["yn-field-base", `yn-field--${this.size}`] }, [
      h(
        ("div"),
        {
          flexDirection: this.display,
          class: ynFieldClassName,
          style
        },
        [...label, ...this.createInput(), ...this.createIcon()]
      ),
    ]);
  }
  created() {
    this.originalText = this.value;
  }
}
