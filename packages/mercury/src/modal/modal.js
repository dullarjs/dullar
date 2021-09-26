/*
 * @Author: liuzx
 * @Date:   2020-01-20 16:43:52
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-09-26 14:05:43
 * @E-mail: justbefree@126.com
 */
import "./style/index.less";
import { defineComponent, genComponentName } from "../modules/component";
import PopupManager from "../modules/popup/popup-manager";
import { addClass } from "../modules/dom";
const VALIDATE_POSITION_VALUE = ["middle"];
import { warn } from "../modules/error";
import Iconfont from "../iconfont";
import { slotsMixins } from "../mixins/slots";
import { isDef } from "../modules/utils";
import { EventBus } from "../modules/event/bus";
import { isPromise } from "../modules/utils";
let idSeed = 1;
export default defineComponent({
  name: "Modal",
  mixins: [slotsMixins],
  components: {
    Iconfont,
  },
  props: {
    beforeClose: Function,
    buttonClick: Function,
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "标题",
    },
    message: {
      type: String,
      default: "messagemessagemessage",
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    footerTopBorder: {
      type: Boolean,
      default: true,
    },
    bodyStyle: {
      type: Object,
      default: () => ({}),
    },
    position: {
      type: String,
      default: "middle",
    },
    closeOnClickModal: {
      type: Boolean,
      default: true,
    },
    borderRadius: {
      type: Number,
      default: 8,
    },
    width: {
      type: String,
      default: "",
    },
    showCancelButton: {
      type: Boolean,
      default: true,
    },
    showConfirmButton: {
      type: Boolean,
      default: true,
    },
    cancelButtonText: {
      type: String,
      default: "取消",
    },
    cancelLoadingText: String,
    confirmButtonText: {
      type: String,
      default: "确定",
    },
    confirmLoadingText: String,
    loadingColor: {
      type: String,
      default: "#007aff",
    },
    buttonSize: {
      type: String,
      default: "default",
    },
    confirmLoadingColor: {
      type: String,
      default: "#FFF",
    },
    lockScreen: {
      type: Boolean,
      default: true,
    },
    showCloseIcon: {
      type: Boolean,
      default: true,
    },
    singleton: {
      type: Boolean,
      default: false,
    },
    fixed: Boolean,
  },
  data() {
    return {
      renderedAsComponent: true,
      time: 0,
      diff: 0,
      events: {},
      zIndex: 200,
      action: "",
      loading: false,
      show: false,
    };
  },
  watch: {
    value: "hanleFastClick",
  },
  methods: {
    getLoadingStatus(e) {
      return this.loading && this.action === e;
    },
    getDisableStatus(e) {
      return this.loading && this.action !== e;
    },
    hanleFastClick(c, o) {
      if (c) {
        this.time = Date.now();
      }
      if (o) {
        this.diff = Date.now() - this.time;
      }
    },
    removeModal() {
      if (this.singleton) {
        document.body.style.overflow = this.bodyOverflow;
      }
      this.events["closeModal"] &&
        typeof this.events["closeModal"] === "function" &&
        this.events["closeModal"]();
      this.events = {};
    },
    handleBeforeEnter(node) {
      let popupCount = EventBus.$data.globalProperties["$modal-count"];
      popupCount = isDef(popupCount) ? ++popupCount : 1;
      EventBus.$set(
        EventBus.$data.globalProperties,
        "$modal-count",
        popupCount
      );
      EventBus.$emit("modal:opening", true);
      this.bodyOverflow = document.body.style.overflow;
      const parent = node.parentNode;
      const modal = document.createElement("div");
      addClass(modal, "v-ynmodal-modal");
      parent.insertBefore(modal, node);
      if (this.singleton) {
        modal.style.zIndex = this.zIndex + idSeed;
        this.$el.style.zIndex = this.zIndex + idSeed + 1;
        if (this.lockScreen) {
          document.body.style.overflow = "hidden";
        }
        this.events["closeModal"] = function () {
          parent.removeChild(modal);
        };
        modal.onclick = () => {
          if (this.closeOnClickModal) {
            this.close();
          }
        };
      } else {
        parent.insertBefore(modal, node);
        PopupManager.register(idSeed, this);
      }
      this.idSeed = idSeed;
      idSeed++;
      this.$emit("beforeEnter");
    },
    handleEnter() {
      this.$emit("enter");
    },
    handleAfterEneter() {
      this.$emit("afterEnter");
    },
    handleBeforeLeave() {
      this.$emit("beforeLeave");
    },
    handleLeave() {
      if (this.diff < 100) {
        if (this.singleton) {
          this.removeModal();
        }
      }
      this.$emit("leave");
    },
    handleAfterLeave() {
      let popupCount = EventBus.$data.globalProperties["$modal-count"];
      popupCount -= 1;
      EventBus.$set(
        EventBus.$data.globalProperties,
        "$modal-count",
        popupCount
      );
      if (popupCount === 0) {
        EventBus.$emit("modal:opening", false);
      }
      if (this.singleton) {
        this.removeModal();
      } else {
        PopupManager.closeModal(this.idSeed);
      }
      this.$emit("afterLeave");
    },
    close() {
      this.$emit("input", false);
      if (!this.renderedAsComponent) {
        this.show = false;
        this.removeDOM();
        this.removeModal();
      }
    },
    removeDOM() {
      const dom = document.getElementsByClassName("v-ynmodal-modal");
      dom.forEach((item) => {
        item.remove();
      });
    },
    isValidatePositionVlaue() {
      return VALIDATE_POSITION_VALUE.indexOf(this.position) > -1;
    },
    getStyle(position) {
      if (position === "bottom") {
        return {
          borderRadius: `${this.borderRadius}px ${this.borderRadius}px 0 0`,
        };
      } else if (position === "top") {
        return {
          borderRadius: `0 0 ${this.borderRadius}px ${this.borderRadius}px`,
        };
      } else {
        return {
          borderRadius: `${this.borderRadius}px`,
        };
      }
    },
    createHeader(h) {
      if (this.showHeader) {
        return h(
          "div",
          {
            class: ["yn-modal-header"],
          },
          [
            h(
              "span",
              {
                class: ["yn-modal-header-title"],
              },
              this.title
            ),
            this.createCloseIcon(h),
          ]
        );
      } else {
        return h("div", {}, [this.slots("header")]);
      }
    },
    createCloseIcon(h) {
      if (this.showCloseIcon) {
        return [
          h(
            "div",
            {
              class: ["yn-modal-closeicon"],
            },
            [
              h(
                genComponentName("iconfont"),
                {
                  props: {
                    name: "close",
                    size: "24",
                  },
                  nativeOn: {
                    click: this.close,
                  },
                },
                []
              ),
            ]
          ),
        ];
      } else {
        return [this.slots("icon")];
      }
    },
    handleButtonClick(e) {
      // console.log(this.callback);
      this.action = e;
      const { beforeClose, renderedAsComponent } = this;
      if (beforeClose) {
        const promise = beforeClose(e);
        if (isPromise(promise)) {
          this.loading = true;
          promise.then((res) => {
            this.loading = false;
            this.action = "";
            this.show = false;
            this.$emit("input", false);
            this.$emit("buttonClick", e, res);
          });
        } else {
          // this.show = false;
          this.$emit("input", false);
          this.$emit("buttonClick", e);
        }
      } else {
        this.$emit("input", false);
        this.$emit("buttonClick", e);
        if (!renderedAsComponent) {
          this.buttonClick(e);
          this.renderedAsComponent = true;
        }
        this.show = false;
      }
    },
    createFooter(h) {
      if (this.showFooter) {
        return h(
          "div",
          {
            class: [
              "yn-modal-footer",
              this.footerTopBorder ? "footer-top-border" : "",
            ],
          },
          [this.getButtons(h)]
        );
      } else {
        return h(
          "div",
          {
            class: ["yn-modal-footer"],
          },
          [this.slots("footer")]
        );
      }
    },
    getButtons(h) {
      const buttons = [];
      if (this.showCancelButton) {
        buttons.push(
          h(
            genComponentName("button"),
            {
              props: {
                loadingColor: this.loadingColor,
                loadingText: this.cancelLoadingText,
                disabled: this.getDisableStatus("cancel"),
                loading: this.getLoadingStatus("cancel"),
                size: this.buttonSize,
              },
              on: {
                click: this.handleButtonClick.bind(this, "cancel"),
              },
              class: ["yn-modal-cancel-button"],
            },
            [this.cancelButtonText]
          )
        );
      }
      if (this.showConfirmButton) {
        const className = buttons.length === 1 ? "vertical-line" : "";
        buttons.push(
          h(
            genComponentName("button"),
            {
              props: {
                type: "primary",
                loadingColor: this.confirmLoadingColor,
                loadingText: this.confirmLoadingText,
                disabled: this.getDisableStatus("confirm"),
                loading: this.getLoadingStatus("confirm"),
                size: this.buttonSize,
              },
              on: {
                click: this.handleButtonClick.bind(this, "confirm"),
              },
              class: ["yn-modal-confirm-button", className],
            },
            [this.confirmButtonText]
          )
        );
      }
      return buttons.length > 0
        ? h(
            "div",
            {
              class: ["yn-modal-buttons"],
            },
            buttons
          )
        : null;
    },
  },
  render(h) {
    let position = "bottom";
    const domProps = {};
    if (!this.renderedAsComponent) {
      domProps.innerHTML = this.message;
    }
    if (this.isValidatePositionVlaue()) {
      position = this.position;
    } else {
      warn(`${this.position} is not a valid value of position props`);
    }
    return h(
      "transition",
      {
        props: {
          name: `yn-modal-slide-${position}`,
        },
        on: {
          beforeEnter: this.handleBeforeEnter,
          enter: this.handleEnter,
          afterEnter: this.handleAfterEneter,
          beforeLeave: this.handleBeforeLeave,
          leave: this.handleLeave,
          afterLeave: this.handleAfterLeave,
        },
      },
      [
        h(
          "div",
          {
            directives: [
              {
                name: "show",
                value: this.show || this.value,
              },
            ],
            // directives: [{
            //   name: "show",
            //   value: this.value,
            // }, ],
            class: ["yn-modal", `yn-modal-${position}`],
            style: {
              width: this.width ? this.width : "",
              ...this.getStyle(position),
            },
          },
          [
            this.createHeader(h),
            h(
              "div",
              {
                style: {
                  padding: "24px",
                  ...this.bodyStyle,
                },
                domProps,
              },
              this.renderedAsComponent ? this.slots() : this.message
            ),
            this.createFooter(h),
          ]
        ),
      ]
    );
  },
});
