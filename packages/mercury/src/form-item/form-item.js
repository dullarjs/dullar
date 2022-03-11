/*
 * @Author: tongh
 * @Date:   2021-09-27 14:49:59
 * @Last Modified by:   tongh
 * @Last Modified time: 2022-03-10 17:32:15
 */
import { defineComponent } from "../modules/component";
import { slotsMixins } from "@/mixins/slots";
import { injectMixins } from "@/mixins/inject";
import { on, off } from "@/modules/event";
export default defineComponent({
  name: "FormItem",

  mixins: [slotsMixins, injectMixins("formWrap")],
  data() {
    return {
      formWrap: this.formWrap,
      required: false,
      requiredMsg: "",
      triggers: ["change", "blur", "keydown", "keyup"],
      message: "",
      formPostMessage: Function,
      childNode: null,
      ruleList: [],
      validator: Function,
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
    afterValidate: {
      type: Object,
      default: null
    }
  },
  watch: {
    afterValidate: function(v) {
      this.message = v && v.success === true ? "" : v.message
    }
  },
  created() {
    this.formPostMessage = this.rules;
  },
  mounted() {
    this.initRule();
  },
  methods: {
    rules(e) {
      let r, value;
      const { type: trigger, validate = false } = e || {};
      if (!validate) {
        value = (e.target && e.target.value) || "";
      } else {
        value = e.value;
      }

      const requiredRes = this.checkRequired(value);
      if (requiredRes) {
        this.message = this.requiredMsg;

        return requiredRes;
      }

      const rules = this.formWrap.rule[this.prop];
      r = rules.filter((item) => {
        const _trigger = item.trigger;
        return  (trigger && (_trigger === trigger || _trigger.indexOf(trigger) > -1)) || validate;
      });
      return this.checkRule(r, value);
    },
    checkRule(rList, value) {
      this.message = "";
      let failed = false;
      for(const item of rList) {
        if (item.min && value.length < item.min) {
          this.message = item.message;
          failed = true;
          break;
        }
        if (item.max && value.length > item.max) {
          this.message = item.message;
          failed = true;
          break;
        }
        if (item.validator && typeof item.validator === "function") {
          this.validator = item.validator;
          const res = this.initValidator();
          if (res.success === false) {
            failed = true;
            break;
          }
        }
      }
      return failed;
    },
    checkRequired(value) {
      const { required } = this;
      if (!required) return false;
      if(Object.prototype.toString.call(value) === '[object Object]' && Object.keys(value).length === 0) {
        return true;
      } else if (Array.isArray(value) && value.length === 0) {
        return true;
      } else if(String(value).trim() === "") {
        return true;
      }
      return false;
    },
    initRule() {
      const rules = this.formWrap.rule[this.prop];
      if (!rules) return false;
      this.childNode =
        this.$refs.formItem.querySelector("input") ||
        this.$refs.formItem.querySelector("select");
      // if (!this.childNode) return false;
      rules.forEach(item => {
        const {triggers} = this;
        if (item.required) {
          this.requiredMsg = item.message;
          this.required = true;
        }
        this.childNode && this.bindListener(item, triggers)
      });
    },
    bindListener(rule, triggers) {
      if(!rule.trigger) return;
      const { ruleList } = this;
      if (Array.isArray(rule.trigger)) {
        // 如果已经绑定默认的监听，不再重复绑定。
        let hasBind = {};
        const _trigger = rule.trigger;
        for(const item of _trigger) {
          const _hasBind = Object.keys(hasBind);
          if (item && triggers.indexOf(item) > -1 && _hasBind.indexOf(item) < 0) {
            hasBind[item] = true;
            this.addEvent(rule, item, ruleList);
          }
        }

      } else {
        if (rule.trigger && triggers.indexOf(rule.trigger) < 0) return;
        this.addEvent(rule, rule.trigger, ruleList);
      }
    },
    addEvent(rule, trigger, ruleList) {
      let _method;
      if(rule.validator && typeof rule.validator === "function") {
        this.validator = rule.validator;
        _method = rule.validator ? this.initValidator : this.rules;
      }
      on(this.childNode, trigger, _method);
      ruleList.push({trigger: trigger, method: _method });
    },
    initValidator() {
      const value = this.formWrap.model[this.prop];
      const resulut = this.validator(value);
      if (resulut && resulut.success === false) {
        this.message = resulut.message;
      }
      return resulut;
    },
    destroyed() {
      const {ruleList} = this;
      ruleList.forEach(item => {
        off(this.childNode, item.trigger, item.method);
      })
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
    const { formWrap, required, label } = this;
    const _isTopPos = formWrap.labelPosition === "top";
    return h(
      "div",
      {
        ref: "formItem",
        class: [ "yn-form-item", required ? "is-required" : "", _isTopPos ? "yn-form-item-top" : ""],
      },
      [
        h(
          "div",
          {
            class: ["label"],
            style: {
              width: formWrap.labelWidth,
              textAlign: _isTopPos ? "left" : formWrap.labelPosition,
              marginBottom : _isTopPos ? "10px" : 0
            },
          },
          [
            ...this.renderRequiredIcon(h),
            h("label", {
              domProps: {
                innerHTML: label,
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
