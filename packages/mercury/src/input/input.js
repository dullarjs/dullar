/*
 * @Author: tongh
 * @Date:   2020-08-25 10:44:56
 * @Last Modified by:   tongh
 * @Last Modified time: 2022-02-16 17:01:17
 */
import { defineComponent, genComponentName } from "../modules/component";
import { slotsMixins } from "@/mixins/slots";
export default defineComponent({
  name: "Input",
  mixins: [slotsMixins],
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    value: String,
    type: {
      type: String,
      default: "text",
    },
    underline: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: [String, Number],
    },
    placeholder: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    prefixIcon: {
      type: [String, Boolean],
      default() {
        return false;
      },
    },
    suffixIcon: {
      type: [String, Boolean],
      default() {
        return false;
      },
    },
    width: {
      type: [Number, String],
      default() {
        return 180;
      },
    },
    height: {
      type: [Number, String],
      default: 34,
    },
    clear: {
      type: Boolean,
      default: false,
    },
    showPassword: {
      type: Boolean,
      default: false,
    },
    cols: {
      type: [String, Number],
      default: 30,
    },
    rows: {
      type: [String, Number],
      default: 10,
    },
    search: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: String,
      default: "14px;",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    resize: {
      type: String,
      default: "vertical",
    },
    iconSize: {
      type: Number,
      default: 16,
    },
  },
  computed: {
    textLength() {
      return (this.value || "").length;
    },
  },
  data() {
    return {
      clearShow: false,
      textArea: false,
      backgroundColor: "",
      cursor: "",
      DataType: "text",
      time: null,
      DataSuffixIcon: "",
      lock: false,
      isFocus: false,
      isSelect: false,
    };
  },
  watch: {
    type: {
      handler(v) {
        this.DataType = v;
        this.textArea = v == "textarea" ? true : false;
      },
      immediate: true,
    },
    disabled: {
      handler(v) {
        if (v) {
          this.backgroundColor = "rgb(235, 235, 228)";
          this.cursor = "not-allowed";
        } else {
          this.backgroundColor = "";
          this.cursor = "";
        }
      },
      immediate: true,
    },
  },
  mounted() {
    let i = this.$refs.inputWrap;
    i.onkeypress = this.f;
    this.DataSuffixIcon = this.suffixIcon;
    if (this.showPassword) this.DataType = "password";
    if (this.search) this.DataSuffixIcon = "search";
  },
  methods: {
    input(e) {
      if (!this.lock) {
        this.$emit("input", e.target.value);
        this.clearShowFn();
      }
    },
    clearFn() {
      this.$emit("input", "");
      this.clearShowFn();
    },
    clearShowFn() {
      !!this.value == false
        ? (this.clearShow = false)
        : (this.clearShow = true);
    },
    onFocus() {
      let _this = this;
      _this.isFocus = true;
      if (_this.time) {
        _this.time = null;
      }
      this.$emit("handleFocus");
      _this.clearShowFn();
    },
    mouseenter(e) {
      console.log(e);
    },
    onBlur() {
      let _this = this;
      _this.time = setTimeout(function () {
        _this.clearShow = false;
        if (_this.isSelect === true) {
          _this.isSelect = false;
          _this.isFocus = true;
        } else {
          _this.isFocus = false;
        }
      }, 200);
    },
    f(e) {
      let ev = e || window.event; //标准化事件处理
      switch (ev.keyCode) {
        case 13:
          this.$emit("change", this.value);
          break;
      }
    },
    // 中文输入法开始
    onCompositionStart() {
      this.lock = true;
    },
    // 中文输入法结束
    onCompositionEnd(e) {
      this.lock = false;
      this.input(e);
    },
    searchBtn() {
      this.$emit("change", this.value);
    },
    ShowPassWordFn() {
      this.DataType = this.DataType == "password" ? "text" : "password";
    },
    createPrefixOrSuffixIcon(h, name, Fn) {
      const temp = [];
      if (this[name]) {
        if (typeof Fn == "function") {
          temp.push(
            h(
              "div",
              {
                domProps: {},
                class: "icon",
              },
              [
                h(genComponentName("iconfont"), {
                  props: {
                    size: this.iconSize,
                    name: this[name],
                  },
                }),
              ]
            )
          );
        } else {
          temp.push(
            h(
              "div",
              {
                domProps: {
                  class: "icon",
                },
              },
              [
                h(genComponentName("iconfont"), {
                  props: {
                    size: this.iconSize,
                    name: this[name],
                  },

                  on: {
                    click: Fn,
                  },
                }),
              ]
            )
          );
        }
      }
      return temp;
    },
    createClearIcon(h) {
      const temp = [];
      if (this.clear) {
        if (this.clearShow) {
          temp.push(
            h(
              "div",
              {
                class: "clearIcon",
              },
              [
                h(
                  "div",
                  {
                    class: "icon",
                  },
                  [
                    h(genComponentName("iconfont"), {
                      props: {
                        name: "clear",
                        size: this.iconSize,
                      },
                      on: {
                        click: this.clearFn,
                      },
                    }),
                  ]
                ),
              ]
            )
          );
        } else {
          temp.push(
            h("div", {
              props: {
                class: "clearIcon",
              },
            })
          );
        }
      }
      return temp;
    },
    createShowPwdIcon(h) {
      const temp = [];
      if (this.showPassword) {
        temp.push(
          h(
            "div",
            {
              class: ["icon"],
            },
            [
              h(genComponentName("iconfont"), {
                props: {
                  name: "yanjing",
                  size: this.iconSize,
                },
                on: {
                  click: this.ShowPassWordFn,
                },
              }),
            ]
          )
        );
      }
      return temp;
    },
    createInput(h) {
      const temp = [];
      temp.push(
        this.slots("prepend", {}, null),
        ...this.createPrefixOrSuffixIcon(h, "prefixIcon"),
        h("input", {
          domProps: {
            value: this.value,

            placeholder: this.placeholder,
            disabled: this.disabled,
            type: this.DataType,
            readonly: this.readonly,
          },
          attrs: {
            maxlength: this.maxlength,
            readonly: this.readonly,
          },
          on: {
            input: this.input,
            focus: this.onFocus,
            blur: this.onBlur,
            compositionstart: this.onCompositionStart,
            compositionend: this.onCompositionEnd,
          },

          style: {
            cursor: this.cursor,
            width: "100px",
            fontSize: this.fontSize,
          },
        }),
        ...this.createClearIcon(h),
        ...this.createShowPwdIcon(h),
        ...this.createPrefixOrSuffixIcon(h, "DataSuffixIcon", this.searchBtn),
        this.slots("append", {}, null)
      );
      return temp;
    },
    createTemplate(h) {
      const temp = [];
      if (!this.textArea) {
        temp.push(...this.createInput(h));
      } else {
        const limit = this.maxlength > 0;
        const _attrs = limit
          ? {
              maxlength: this.maxlength,
            }
          : {};
        temp.push(
          h(
            "textarea",
            {
              on: {
                input: this.input,
              },
              props: {
                ...this.$attrs,
              },
              attrs: { ..._attrs, disabled: this.disabled },
              style: {
                fontSize: this.fontSize,
                resize: this.resize,
                width: this.width + "px",
                height: this.height + "px",
              },
            },
            [this.value]
          )
        );
        if (limit) {
          temp.push(
            h(
              "div",
              {
                class: ["yn-input-textarea-counter"],
              },
              [h("span", {}, `${this.textLength}/${parseInt(this.maxlength)}`)]
            )
          );
        }
      }
      return temp;
    },
  },

  render(h) {
    return h(
      "div",
      {
        class: [
          "yn-input-wrap",
          this.underline ? "yn-input-wrap-underline" : undefined,
        ],
        ref: "inputWrap",
        style: {
          width: this.width + "px",
          height: !this.textArea && this.height + "px",
          backgroundColor: this.backgroundColor,
          cursor: this.cursor,
          borderColor: this.isFocus ? "#139ff0" : "#dcdfe6",
          [this.underline ? "borderBottom" : "border"]: this.textArea
            ? "none"
            : "1px solid #dcdfe6",
        },
      },
      [...this.createTemplate(h)]
    );
  },
});
