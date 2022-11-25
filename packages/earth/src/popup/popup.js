/*
 * @Author: Just be free
 * @Date:   2020-01-20 16:43:52
 * @Last Modified by:   Just be free
 * @Last Modified time: 2022-08-16 19:27:57
 * @E-mail: justbefree@126.com
 */
import Iconfont from "../iconfont";
import { isDef } from "../modules/utils";
import { warn } from "../modules/error";
import { addClass } from "../modules/dom";
import { slotsMixins } from "../mixins/slots";
import { EventBus } from "../modules/event/bus";
import { stopPropagation } from "../modules/event";
import PopupManager from "../modules/popup/popup-manager";
import { defineComponent, genComponentName } from "../modules/component";

let idSeed = 1;
const VALIDATE_POSITION_VALUE = ["left", "right", "top", "bottom", "middle"];

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
    routerHashName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      time: 0,
      diff: 0,
      events: {},
      zIndex: 2000,
    };
  },
  computed: {
    existRouterHashName() {
      const { query } = this.$route;
      return this.routerHashName && this.routerHashName in query;
    },
    hasBackRecord() {
      if (!this.routerHashName) return false;
      return window.history.state?.routerHashName === this.routerHashName;
    },
  },
  watch: {
    value: "handleFastClick",
  },
  methods: {
    setHistoryState(state) {
      window.history.replaceState(
        {
          ...history.state,
          ...state,
        },
        document.title
      );
    },
    async addQuery() {
      if (!this.existRouterHashName) {
        const newQuery = { ...this.$route.query };
        if (this.routerHashName) newQuery[this.routerHashName] = "_popup";
        await this.$router.push({
          query: newQuery,
        });
        this.setHistoryState({
          routerHashName: this.routerHashName,
        });
      }
    },
    removeQuery() {
      if (this.routerHashName && this.existRouterHashName) {
        const newQuery = { ...this.$route.query };
        delete newQuery[this.routerHashName];
        this.$router.replace({
          query: newQuery,
        });
      }
    },
    handleFastClick(c, o) {
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
        document.body.parentNode.style.overflow = this.htmlOverflow;
      }
      this.events["closeModal"] &&
        typeof this.events["closeModal"] === "function" &&
        this.events["closeModal"]();
      this.events = {};
    },
    handleBeforeEnter(node) {
      if (this.routerHashName) {
        this.addQuery();
      }
      let popupCount = EventBus.$data.globalProperties["$popup-count"];
      popupCount = isDef(popupCount) ? ++popupCount : 1;
      EventBus.$set(
        EventBus.$data.globalProperties,
        "$popup-count",
        popupCount
      );
      EventBus.$emit("popup:opening", true);
      this.bodyOverflow = document.body.style.overflow;
      this.htmlOverflow = document.body.parentNode.style.overflow;
      const parent = node.parentNode;
      const modal = document.createElement("div");
      addClass(modal, "v-ynpopup-modal");
      parent.insertBefore(modal, node);
      if (this.singleton) {
        modal.style.zIndex = this.zIndex + idSeed;
        this.$el.style.zIndex = this.zIndex + idSeed + 1;
        if (this.lockScreen) {
          document.body.style.overflow = "hidden";
          document.body.parentNode.style.overflow = "hidden";
        }
        this.events["closeModal"] = function () {
          parent.removeChild(modal);
        };
        modal.onclick = (e) => {
          stopPropagation(e);
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
      this.$emit("beforeEnter", { modal });
    },
    handleEnter() {
      this.$emit("enter");
    },
    handleAfterEnter() {
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
      if (this.hasBackRecord) {
        this.$router.back();
      } else {
        this.removeQuery();
      }
    },
    close() {
      this.$emit("input", false);
    },
    isValidatePositionValue() {
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
                  props: { name: "close", size: "12" },
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
  mounted() {
    const hashName = this.routerHashName;
    if (hashName !== "") {
      EventBus.$on("location:hashchange", (ev) => {
        const { oldURL, newURL } = ev;
        const changes = oldURL.replace(newURL, "");
        if (changes.includes(hashName)) {
          // 路由返回触发的时候需要关闭弹框
          this.$emit("input", false);
        }
      });
    }
  },
  render(h) {
    let position = "bottom";
    if (this.isValidatePositionValue()) {
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
          afterEnter: this.handleAfterEnter,
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
