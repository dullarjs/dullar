/*
 * @Author: Just be free
 * @Date:   2020-04-24 12:04:15
 * @Last Modified by:   Just be free
 * @Last Modified time: 2023-01-12 10:02:23
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import { slotsMixins } from "../mixins/slots";
import Flex from "../flex";
import FlexItem from "../flex-item";
import Button from "../button";
import Popup from "../popup";
import Iconfont from "../iconfont";
const VALIDE_POPUP_CONTENT_COMPONENT = "submit-action-popup-content";
const VALIDE_VALUE_COMPONENT = "submit-action-value";
const VALIDD_TEXT_COMPONENT = "submit-action-text";
export default defineComponent({
  name: "SubmitAction",
  mixins: [slotsMixins],
  components: { Flex, FlexItem, Popup, Button, Iconfont },
  props: {
    submitText: {
      type: String,
      default: "提交",
    },
    label: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "0",
    },
    valueDescription: {
      type: String,
      default: "",
    },
    currencySymbol: {
      type: String,
      default: "&yen;",
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
    fixed: Boolean,
    disabled: {
      type: Boolean,
      default: false,
    },
    leftFlex: {
      type: [String, Number],
      default: 2,
    },
    rightFlex: {
      type: [String, Number],
      default: 1,
    },
    popupStyle: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      showPopup: false,
      popupStatus: false,
      submitStatus: "resolved",
    };
  },
  methods: {
    submit() {
      if (this.popupStatus) {
        this.submitStatus = "pendding";
        this.toggle();
      } else {
        this.$emit("submit");
      }
    },
    toggle() {
      this.showPopup = !this.showPopup;
      this.$emit("trigger", this.showPopup);
    },
    view() {
      this.showPopup = true;
    },
    setActionPopupStyle() {
      const rect = this.$el.getBoundingClientRect();
      this.$refs.actionPopup.style.bottom = `${
        window.innerHeight - rect.top
      }px`;
    },
    handleBeforeEnter() {
      this.$emit("beforeEnter");
      this.popupStatus = true;
      this.setActionPopupStyle();
    },
    handleAfterLeave() {
      this.popupStatus = false;
      this.$emit("afterLeave");
      if (this.submitStatus === "pendding") {
        this.$emit("submit");
        this.submitStatus = "resolved";
      }
    },
    getValideContent(type, slots = []) {
      const prefix = this.VUE_APP_PREFIX;
      const validComponent = [];
      let valideName;
      if (type === "value") {
        valideName = `${prefix}-${VALIDE_VALUE_COMPONENT}`;
      } else if (type === "content") {
        valideName = `${prefix}-${VALIDE_POPUP_CONTENT_COMPONENT}`;
      } else if (type === "text") {
        valideName = `${prefix}-${VALIDD_TEXT_COMPONENT}`;
      }
      slots &&
        slots.forEach((child) => {
          if (
            child.componentOptions &&
            valideName === child.componentOptions.tag
          ) {
            validComponent.push(child);
          }
        });
      return validComponent;
    },
    genValue(h, slots) {
      const value = this.getValideContent("value", slots);
      if (value.length > 0) {
        return value;
      } else {
        const hasDescription = this.valueDescription !== "";
        return h(
          genComponentName("flex"),
          {
            class: ["custom-value", hasDescription ? "normal-line-height" : ""],
            props: { flexDirection: "column", justifyContent: "spaceBetween" },
          },
          [
            h(genComponentName("flex-item"), { props: { flex: "none" } }, [
              h(
                "span",
                {
                  class: [
                    "yn-submit-action-currency",
                    hasDescription ? "line-height-26" : "inherit-line-height",
                  ],
                },
                [
                  h(
                    "small",
                    { domProps: { innerHTML: this.currencySymbol } },
                    []
                  ),
                  h("b", {}, [this.value]),
                  hasDescription && this.genIcon(h),
                ]
              ),
            ]),
            hasDescription &&
              h(
                genComponentName("flex-item"),
                {
                  class: ["yn-submit-value-description"],
                  props: { flex: "none" },
                },
                [this.valueDescription]
              ),
          ]
        );
      }
    },
    genIcon(h) {
      if (this.showIcon) {
        const rotate = this.showPopup ? 180 : 0;
        return h("span", { class: ["yn-submit-action-icon"] }, [
          h(
            genComponentName("iconfont"),
            { props: { name: "arrow-up", size: 18, rotate } },
            []
          ),
        ]);
      }
    },
  },
  render(h) {
    const slots = this.slots();
    const popupContent = this.getValideContent("content", slots);
    const hasPopup = Array.isArray(popupContent) && popupContent.length > 0;
    const hasDescription = this.valueDescription !== "";
    return h(
      "div",
      { class: ["yn-submit-action", this.fixed ? "fixed" : ""] },
      [
        hasPopup &&
          h(
            "div",
            {
              class: ["yn-submit-action-popup"],
              ref: "actionPopup",
              directives: [{ name: "show", value: this.popupStatus }],
            },
            [
              h(
                genComponentName("popup"),
                {
                  style: { position: "absolute", ...this.popupStyle },
                  props: { value: this.showPopup, singleton: true },
                  on: {
                    beforeEnter: this.handleBeforeEnter,
                    afterLeave: this.handleAfterLeave,
                    input: this.toggle,
                  },
                },
                [
                  h("div", { class: ["yn-submit-action-content"] }, [
                    popupContent,
                  ]),
                ]
              ),
            ]
          ),
        h(
          genComponentName("flex"),
          { class: ["yn-submit-action-flex"], props: { alignItems: "center" } },
          [
            this.label !== "" &&
              h(
                genComponentName("flex-item"),
                {
                  props: { flex: this.leftFlex }, on: { click: this.toggle }
                },
                [
                  h(
                    genComponentName("flex"),
                    { props: { alignItems: "center" } },
                    [
                      h(genComponentName("flex-item"), {}, [
                        h("span", { class: ["yn-submit-action-total-text"] }, [
                          this.label,
                        ]),
                      ]),
                      h(genComponentName("flex-item"), {}, [
                        this.genValue(h, slots),
                      ]),
                      h(genComponentName("flex-item"), {}, [
                        hasPopup && !hasDescription && this.genIcon(h),
                      ]),
                    ]
                  ),
                ]
              ),
            this.label === "" &&
              h(
                genComponentName("flex-item"),
                {
                  props: { flex: this.leftFlex }, on: { click: this.toggle }
                },
                [this.getValideContent("text", slots)]
              ),
            h(
              genComponentName("flex-item"),
              { props: { flex: this.rightFlex } },
              [
                h(
                  genComponentName("button"),
                  {
                    class: ["yn-submit-action-button"],
                    props: {
                      type: "primary",
                      size: "large",
                      disabled: this.disabled,
                    },
                    on: { click: this.submit },
                  },
                  [this.submitText]
                ),
              ]
            ),
          ]
        ),
      ]
    );
  },
});
