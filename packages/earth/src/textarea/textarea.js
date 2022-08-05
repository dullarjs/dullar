/*
 * @Author: Just be free
 * @Date:   2021-12-29 13:41:28
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-08-05 13:32:51
 * @E-mail: justbefree@126.com
 */

import { defineComponent } from "../modules/component";
import { getPropertyValue } from "../modules/dom/style";
import { getScroller } from "../modules/dom/scroll";
import { clearBr } from "../modules/utils";
import { autoWrap } from "../modules/textarea";
export default defineComponent({
  name: "Textarea",
  props: {
    value: String,
    maxHeight: {
      type: Number,
      default: 200,
    },
    fixedCursor: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      scrollElement: null,
      minHeight: 24,
      focused: false,
    };
  },
  methods: {
    handleAutoWrap(elem) {
      const { minHeight, maxHeight } = this;
      autoWrap(elem, this.scrollElement, { maxHeight, minHeight });
    },
    handleInput(e) {
      this.$emit("change", { e, wrapped: this.wrapped, focused: this.focused });
      e.target.value = e.target.value.replace(/\n/, "");
      this.$emit("input", clearBr(e.target.value));
      this.handleAutoWrap(e.target);
    },
    handleFocus(e) {
      const value = e.target.value;
      this.focused = true;
      this.$emit("focus", { e, wrapped: this.wrapped, focused: this.focused });
      if (this.fixedCursor && value !== "") {
        const obj = this.$refs.textarea;
        const timer = setTimeout(() => {
          obj.selectionStart = e.target.value.length;
          clearTimeout(timer);
        }, 10);
      }
    },
    handleBlur(e) {
      this.focused = false;
      this.$emit("blur", { e, wrapped: this.wrapped, focused: this.focused });
    },
  },
  mounted() {
    this.scrollElement = getScroller(this.$el);
    this.minHeight = parseInt(getPropertyValue(this.$el, "height"));
  },
  watch: {
    value: {
      handler() {
        this.$nextTick(() => {
          this.handleAutoWrap(this.$refs.textarea);
        });
      },
      deep: true,
    },
  },

  render(h) {
    const props = this.$props;
    return h(
      "textarea",
      {
        ref: "textarea",
        class: ["yn-textarea", this.focused ? "focused" : "blured"],
        attrs: { ...props },
        domProps: { value: this.value },
        on: {
          input: this.handleInput,
          focus: this.handleFocus,
          blur: this.handleBlur,
        },
      },
      []
    );
  },
});
