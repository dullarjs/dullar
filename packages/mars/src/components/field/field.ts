/*
 * @Author: Just be free
 * @Date:   2020-01-16 15:50:12
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-10-22 10:41:32
 */

import "./style/index.scss";
import Vue, { CreateElement, VNode } from "vue";
import { Component, Prop, Mixins } from "vue-property-decorator";
import { encrypt } from "@/utils";
import { slotsMixins } from "../mixins/slots";
import Iconfont from "../iconfont";
import { AnyObject } from "@/types";
const VALID_TYPE = ["number", "textarea", "password", "text", "email", "tel"];
@Component({
  name: "Field",
  components: { Iconfont }
})
export default class Field extends Mixins(Vue, slotsMixins){
  static componentName = "YnField";
  target!: HTMLInputElement;
  showIcon = false;
  showEncryptInput = false;
  inputing = false;
  originalText: string | number = "";
  
  @Prop({
    type: String
  })
  labelWidth!: string;
  @Prop({
    type: [Number, String],
    default: ""
  })
  value!: number | string;
  @Prop({
    type: String,
    default: ""
  })
  label!: string;
  @Prop({
    type: String,
    default: ""
  })
  placeholder!: string;
  @Prop({
    type: [Number, String],
  })
  maxlength!: number | string;
  @Prop({
    type: Boolean,
    default: false,
  })
  readonly!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  autofocus!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  required!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  disabled!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  clearable!: boolean;
  @Prop({
    type: String,
    default: "address"
  })
  interactive!: string;
  @Prop({
    type: String,
    default: "text",
  })
  type!: string;
  @Prop({
    type: String
  })
  iconName!: string;
  @Prop({
    type: Boolean,
    default: false,
  })
  showTextareaCounter!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  encrypted!: boolean;
  @Prop({
    type: String,
    default: "row",
  })
  display!: string;
  @Prop({
    type: String
  })
  pattern!: string;
  @Prop({
    type: Function,
    default: encrypt,
  })
  encrypt!: (arg: string | number) => string;

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
  createInput(h: CreateElement) {
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
      focus: this.handleOnFocus,
      blur: this.handleOnBlur,
      input: this.handleInput,
    };
    const className = [];
    if (this.disabled) {
      className.push("disable");
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
                  class: ["textarea-ele", ...className],
                  on: { ...events },
                  attrs: { ...attrs },
                  domProps,
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
                  on: { ...events },
                  class: ["input-ele", ...className],
                  attrs: { ...attrs, type: this.type },
                  domProps,
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
  createIcon(h: CreateElement) {
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
            on: { click: this.handleIconClick },
          },
          [
            h(
              "iconfont",
              { props: { name, size: "16" } },
              []
            ),
          ]
        )
      );
    }
    return icon;
  }
  genLabel(h: CreateElement, label: VNode[] | string) {
    const style: AnyObject = {};
    if (this.labelWidth) {
      style.width = this.labelWidth
    }
    return h(("span"),
      { class: ["yn-field-label"], style },
      label
    );
  }
  render(h: CreateElement) {
    const slots = this.slots("label");
    const label = [];
    if (slots && slots.length > 0) {
      label.push(this.genLabel(h, slots));
    } else if (this.label) {
      label.push(this.genLabel(h, this.label));
    }
    const ynFieldClassName = [
      "yn-field-container",
      this.clearable || this.iconName ? "yn-field--suffix" : ""
    ];
    return h("div", { class: ["yn-field-base"] }, [
      h(
        ("div"),
        {
          props: { flexDirection: this.display },
          class: ynFieldClassName,
        },
        [...label, ...this.createInput(h), ...this.createIcon(h)]
      ),
    ]);
  }
  created() {
    this.originalText = this.value;
  }
}
