/*
 * @Author: Just be free
 * @Date:   2020-01-16 15:50:12
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-10-20 11:24:36
 */

import { defineComponent, genComponentName } from "../modules/component";
import { encrypt } from "../modules/utils";
import Flex from "../flex";
import FlexItem from "../flex-item";
import Iconfont from "../iconfont";
const VALID_TYPE = ["number", "textarea", "password", "text", "email", "tel"];
import { slotsMixins } from "../mixins/slots";
export default defineComponent({
  name: "Field",
  mixins: [slotsMixins],
  components: { Flex, FlexItem, Iconfont },
  props: {
    value: {
      type: [Number, String],
      default: "",
    },
    label: String,
    placeholder: String,
    maxlength: [Number, String],
    readonly: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    showEditIcon: {
      type: Boolean,
      default: false,
    },
    interactive: {
      type: String,
      default: "address",
      require: false,
    },
    type: {
      type: String,
      default: "text",
    },
    iconName: String,
    showTextareaCounter: {
      type: Boolean,
      default: false,
    },
    encrypted: {
      type: Boolean,
      default: false,
    },
    display: {
      type: String,
      default: "row",
    },
    pattern: String,
    encrypt: {
      type: Function,
      default: encrypt,
    },
  },
  data() {
    return {
      target: null,
      showClearIcon: false,
      showEditableIcon: false,
      showEncryptInput: false,
      inputing: false,
      focused: false,
    };
  },
  initPropsToData() {
    return [
      { key: "originalText", value: "value" },
      { key: "focused", value: "autofocus" },
      { key: "showEditableIcon", value: "showEditIcon" },
    ];
  },
  methods: {
    handleOnFocus(e) {
      this.focused = true;
      this.showEditableIcon = false;
      this.target = e.target;
      this.$emit("focus", e);
      this.$emit("click", e);
      if (this.value === "") {
        this.showClearIcon = false;
      }
      if (this.encrypted) {
        e.target.value = "";
        this.$emit("input", "");
      }
    },
    handleOnBlur(e) {
      this.inputing = false;
      this.focused = false;
      this.showEditableIcon = true;
      if (this.encrypted) {
        if (this.value === "") {
          this.$emit("input", this.originalText);
        } else {
          this.originalText = e.target.value;
        }
      }
      this.$emit("blur", e);
    },
    handleInput(e) {
      this.showEditableIcon = false;
      if (this.clearable && e.target.value) {
        this.showClearIcon = true;
      } else {
        this.showClearIcon = false;
      }
      this.inputing = true;
      this.$emit("input", e.target.value);
    },
    handleIconClick() {
      if (this.clearable) {
        this.target.value = "";
        this.$emit("input", "");
        this.showClearIcon = false;
        return false;
      }
    },
    createInput(h) {
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
              genComponentName("flex-item"),
              { class: ["yn-field-textarea"], props: { flex: 1 } },
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
                  [h("span", {}, `${this.value.length}/${this.maxlength}`)]
                ),
              ]
            )
          );
        } else {
          area.push(
            h(
              genComponentName("flex-item"),
              { class: ["yn-field-input"], props: { flex: 1 } },
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
    },
    createIcon(h) {
      const icon = [];
      let name = this.clearable ? "clear" : this.iconName;
      if (this.showEditIcon) {
        // this.showEditableIcon = true;
        if (this.focused) {
          name = "clear";
        } else {
          name = "edit";
        }
      }
      const directives = this.clearable
        ? [{ name: "show", value: this.showClearIcon || this.showEditableIcon }]
        : [];
      if (this.clearable || this.iconName) {
        icon.push(
          h(
            genComponentName("flex-item"),
            {
              directives,
              on: { click: this.handleIconClick },
            },
            [
              h(
                genComponentName("iconfont"),
                { props: { name, size: "16" } },
                []
              ),
            ]
          )
        );
      }
      return icon;
    },
    genLabel(h, label) {
      return h(genComponentName("flex-item"), { class: ["yn-field-label"] }, [
        h("span", {}, label),
      ]);
    },
  },
  render(h) {
    const slots = this.slots("label");
    const label = [];
    if (slots && slots.length > 0) {
      label.push(this.genLabel(h, slots));
    } else if (this.label) {
      label.push(this.genLabel(h, this.label));
    }
    return h("div", { class: ["yn-field-base", "border-top-bottom"] }, [
      h(
        genComponentName("flex"),
        {
          props: { flexDirection: this.display },
          class: ["yn-field-container"],
        },
        [...label, ...this.createInput(h), ...this.createIcon(h)]
      ),
    ]);
  },
});
