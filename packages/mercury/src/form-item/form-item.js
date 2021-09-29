/*
 * @Author: tongh
 * @Date:   2021-09-27 14:49:59
 * @Last Modified by:   tongh
 * @Last Modified time: 2021-09-29 16:49:59
 */
import { defineComponent } from "../modules/component";
import { slotsMixins } from "@/mixins/slots";
import { injectMixins } from "@/mixins/inject";
import { on } from "@/modules/event";
export default defineComponent({
  name: "FormItem",

  mixins: [slotsMixins, injectMixins("formWrap")],
  data() {
    return {
      formWrap: this.formWrap,
      required: false,
      triggers: ["change", "blur"],
      message: "",
      formPostMessage: Function,
    };
  },
  props: {
    prop: {
      type: String,
      default() {},
    },
    label: {
      type: String,
    },
  },
  created() {
    this.formPostMessage = this.rules;
  },
  mounted() {
    this.initRule();
  },
  methods: {
    rules(value, trigger) {
      let rules = this.formWrap.rule[this.prop];
      let r;
      let count = 0;
      r = rules.filter((item) => {
        if (trigger) {
          return item.trigger == trigger;
        } else {
          return item;
        }
      });
      r.forEach((item) => {
        if (item.required && String(value).trim() == "") {
          this.message = item.message;
          count++;
          return false;
        }
        if (item.min && value.length < item.min) {
          this.message = item.message;
          count++;
          return false;
        }
        if (item.max && value.length > item.max) {
          this.message = item.message;
          count++;
          return false;
        }
        if (item.pattern && !item.pattern.test(value)) {
          this.message = item.message;
          count++;
          return false;
        }
        this.message = "";
        count = 0;
      });
      return count;
    },

    initRule() {
      const rules = this.formWrap.rule[this.prop];
      if (!rules) return false;
      this.required = rules.some((item) => {
        return item.required;
      });
      const dom =
        this.$refs.formItem.querySelector("input") ||
        this.$refs.formItem.querySelector("select");
      if (!dom) return false;
      on(dom, "blur", (e) => {
        this.rules(e.target.value, "blur");
      });
      on(dom, "input", (e) => {
        this.rules(e.target.value, "change");
      });
    },
    renderRequiredIcon(h) {
      let temp = [];
      if (this.required) {
        temp.push(
          h(
            "span",
            {
              class: ["required-icon"],
              domProps: {
                innerHTML: "*",
              },
            },
            []
          )
        );
      }
      return temp;
    },
    renderError(h) {
      let temp = [];
      if (this.message) {
        temp.push(
          h("div", {
            class: ["error"],

            domProps: {
              innerHTML: this.message,
            },
          })
        );
      }
      return temp;
    },
  },

  render(h) {
    return h(
      "div",
      {
        ref: "formItem",
        class: ["yn-form-item", this.required ? "is-required" : ""],
      },
      [
        h(
          "div",
          {
            class: ["label"],
            style: {
              width: this.formWrap.labelWidth,
            },
          },
          [
            ...this.renderRequiredIcon(h),
            h("b", {
              domProps: {
                innerHTML: this.label,
              },
            }),
          ]
        ),
        h(
          "span",
          {
            class: ["yn-form-item-content"],
          },
          [this.slots(), ...this.renderError(h)]
        ),
      ]
    );
  },
});
