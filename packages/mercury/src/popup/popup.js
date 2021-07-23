/*
 * @Author: Just be free
 * @Date:   2020-01-20 16:43:52
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-07-21 15:02:29
 * @E-mail: justbefree@126.com
 */
import { defineComponent, genComponentName } from "../modules/component";
import PopupManager from "../modules/popup/popup-manager";
import { addClass } from "../modules/dom";
const VALIDATE_POSITION_VALUE = ["left", "right", "top", "bottom", "middle"];
import { warn } from "../modules/error";
import Iconfont from "../iconfont";
import { slotsMixins } from "../mixins/slots";
import { isDef } from "../modules/utils";
import { EventBus } from "../modules/event/bus";
let idSeed = 1;
export default defineComponent({
  name: "Popup",
  mixins: [slotsMixins],
  components: {
    Iconfont,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: "bottom",
    },
    closeOnClickModal: {
      type: Boolean,
      default: true,
    },
    borderRadius: {
      type: Number,
      default: 10,
    },
    lockScreen: {
      type: Boolean,
      default: true,
    },
    showCloseIcon: {
      type: Boolean,
      default: false,
    },
    singleton: {
      type: Boolean,
      default: false,
    },
    fixed: Boolean,
  },
  data() {
    return {
      time: 0,
      diff: 0,
      events: {},
      zIndex: 2000,
    };
  },
  watch: {
    value: "hanleFastClick",
  },
  methods: {
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
      let popupCount = EventBus.$data.globalProperties["$popup-count"];
      popupCount = isDef(popupCount) ? ++popupCount : 1;
      EventBus.$set(
        EventBus.$data.globalProperties,
        "$popup-count",
        popupCount
      );
      EventBus.$emit("popup:opening", true);
      this.bodyOverflow = document.body.style.overflow;
      const parent = node.parentNode;
      const modal = document.createElement("div");
      addClass(modal, "v-ynpopup-modal");
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
      if (this.diff < 1000) {
        if (this.singleton) {
          this.removeModal();
        }
      }
      this.$emit("leave");
    },
    handleAfterLeave() {
      let popupCount = EventBus.$data.globalProperties["$popup-count"];
      popupCount -= 1;
      EventBus.$set(
        EventBus.$data.globalProperties,
        "$popup-count",
        popupCount
      );
      if (popupCount === 0) {
        EventBus.$emit("popup:opening", false);
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
        return {};
      }
    },
    createCloseIcon(h) {
      if (this.showCloseIcon) {
        return [
          h(
            "div",
            { class: ["yn-popup-closeicon", this.fixed ? "fixed" : ""] },
            [
              h(
                genComponentName("iconfont"),
                {
                  props: { name: "close", size: "24" },
                  nativeOn: { click: this.close },
                },
                []
              ),
            ]
          ),
        ];
      } else {
        return [];
      }
    },
  },
  render(h) {
    let position = "bottom";
    if (this.isValidatePositionVlaue()) {
      position = this.position;
    } else {
      warn(`${this.position} is not a valid value of position props`);
    }
    return h(
      "transition",
      {
        props: { name: `yn-popup-slide-${position}` },
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
            directives: [{ name: "show", value: this.value }],
            class: ["yn-popup", `yn-popup-${position}`],
            style: { ...this.getStyle(position) },
          },
          [...this.createCloseIcon(h), this.slots()]
        ),
      ]
    );
  },
});
