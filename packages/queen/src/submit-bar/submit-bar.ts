/*
* @Author: Just be free
* @Date:   2020-11-30 11:11:58
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-07 16:35:45
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import QFlex from "../flex";
import QFlexItem from "../flex-item";
import QPopup from "../popup";
import QIcon from "../icon";
import QButton from "../button";
import { h, withDirectives, vShow, VNode } from "vue";
const VALID_POPUP_CONTENT_COMPONENT = "QSubmitBarPopupContent";
const VALID_VALUE_COMPONENT = "QSubmitBarValue";
const VALID_TEXT_COMPONENT = "QSubmitBarText";
class Props {
  submitText = prop<string>({ default: "提交" })
  label = prop<string>({ default: "" })
  value = prop<string>({ default: "0" })
  valueDescription = prop<string>({ default: "" })
  currencySymbol = prop<string>({ default: "&yen;" })
  showIcon = prop<boolean>({ default: true })
  fixed?: boolean
  disabled = prop<boolean>({ default: false })
  leftFlex = prop<string|number>({ default: 2 })
  rightFlex = prop<string|number>({ default: 1 })
}

@Options({
  name: "QSubmitBar",
  emits: ["trigger", "beforeenter", "afterleave", "submit"]
})
export default class QSubmitBar extends mixins(Queen).with(Props) {
  public static componentName = "QSubmitBar";
  public showPopup = false;
  public popupStatus = false;
  public submitStatus = "resolved";
  toggle() {
    this.showPopup = !this.showPopup;
    this.$emit("trigger", this.showPopup);
  }
  genValue(): VNode|VNode[] {
    const value = this.getCustomSlotsByTagName(VALID_VALUE_COMPONENT);
    if (Array.isArray(value) && value.length > 0) {
      return value;
    } else {
      const hasDescription = this.valueDescription !== "";
      // return h("span", { class: ["q-submit-action-currency"] }, {
      //   default: () => [
      //     h("small", { innerHTML: this.currencySymbol }, { default: () => [] }),
      //     h("b", {}, { default: () => [this.value] }),
      //   ]
      // });
      return h(QFlex, { class: ["custom-value", hasDescription ? "initial-line-height" : ""], flexDirection: "column", justifyContent: "spaceBetween" }, {
        default: () => [
          h(QFlexItem, { flex: 2 }, { default: () => [
            h(
              "span",
              {
                class: [
                  "q-submit-action-currency",
                  hasDescription ? "line-height-26" : "inherit-line-height",
                ],
              },
              [
                h(
                  "small",
                  { innerHTML: this.currencySymbol },
                  { default: () => [] }
                ),
                h("b", {}, { default: () => [this.value] }),
                hasDescription && this.genIcon(),
              ]
            ),
          ] }),
          hasDescription && h(QFlexItem, { class: ["q-submit-value-description"], flex: 1 }, {
            default: () => [this.valueDescription]
          })
        ]
      })
    }
  }
  genIcon(): undefined|VNode {
    if (this.showIcon) {
      const iconName = this.showPopup
        ? "arrow-down"
        : "arrow-up";
      return h("span", { class: ["q-submit-action-icon"] }, {
        default: () => [
          h(QIcon,
            { name: iconName, size: 12 },
            { default: () => [] }
          )
        ]
      });
    }
  }
  setActionPopupStyle(): void {
    const rect = this.$el.getBoundingClientRect();
    (this.$refs.actionPopup as HTMLElement).style.bottom = `${
      window.innerHeight - rect.top
    }px`;
  }
  beforeEnter(): void {
    this.$emit("beforeenter");
    this.popupStatus = true;
    this.setActionPopupStyle();
  }
  afterLeave(): void {
    this.popupStatus = false;
    this.$emit("afterleave");
    if (this.submitStatus === "pendding") {
      this.$emit("submit");
      this.submitStatus = "resolved";
    }
  }
  submit(): void {
    if (this.popupStatus) {
      this.submitStatus = "pendding";
      this.toggle();
    } else {
      this.$emit("submit");
    }
  }
  view() {
    this.showPopup = true;
  }
  render() {
    const popupContent = this.getCustomSlotsByTagName(VALID_POPUP_CONTENT_COMPONENT);
    const hasPopup = popupContent && Array.isArray(popupContent) && popupContent.length > 0;
    const hasDescription = this.valueDescription !== "";
    const hasLabel = this.label !== "";
    return h(
      "div",
      { class: ["q-submit-action", this.fixed ? "fixed" : ""] },
      {
        default: () => [
          withDirectives(h(
            "div",
            {
              class: ["q-submit-action-popup"],
              ref: "actionPopup",
            },
            {
              default: () => [
                hasPopup && h(QPopup,
                  {
                    style: { position: "absolute" },
                    modelValue: this.showPopup,
                    singleton: true,
                    onBeforeenter: this.beforeEnter,
                    onAfterleave: this.afterLeave,
                    onInput: this.toggle
                  },
                  {
                    default: () => [
                      h("div", { class: ["q-submit-action-content"] }, {
                        default: () => popupContent
                      })
                    ]
                  }
                ),
              ]
            }
          ), [[vShow, this.popupStatus]]),
          h(QFlex, { class: ["q-submit-action-flex"] }, {
            default: () => [
              hasLabel && h(QFlexItem,
                { flex: this.leftFlex, onClick: this.toggle },
                {
                  default: () => [
                    h(QFlex, { alignItems: "center" }, {
                      default: () => [
                        h(QFlexItem, {}, {
                          default: () => [
                            h("span", { class: ["q-submit-action-total-text"] }, {
                              default: () => [
                                this.label,
                              ]
                            }),
                          ]
                        }),
                        h(QFlexItem, {}, { default: () => [this.genValue()] }),
                        h(QFlexItem, {}, { default: () => [hasPopup && !hasDescription && this.genIcon()] }),
                      ]
                    }),
                  ]
                }
              ),
              !hasLabel && h(QFlexItem, { flex: this.leftFlex }, {
                default: () => [
                  this.getCustomSlotsByTagName(VALID_TEXT_COMPONENT)
                ]
              }),
              h(QFlexItem, { flex: this.rightFlex }, {
                default: () => [
                  h(QButton,
                    {
                      class: ["q-submit-action-button"],
                      type: "primary",
                      size: "large",
                      disabled: this.disabled,
                      onClick: this.submit,
                    },
                    { default: () => [this.submitText] }
                  ),
                ]
              }),
            ]
          }),
        ]
      }
    );
  }
}
