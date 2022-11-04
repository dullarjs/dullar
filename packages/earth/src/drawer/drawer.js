/*
* @Author: Just be free
* @Date:   2022-06-16 09:55:15
* @Last Modified by:   Just be free
* @Last Modified time: 2022-11-04 13:38:20
* @E-mail: justbefree@126.com
*/
import { defineComponent, genComponentName } from "../modules/component";
import Iconfont from "../iconfont";
import { slotsMixins } from "../mixins/slots";
import Flex from "../flex";
import FlexItem from "../flex-item";
import Button from "../button";
import Popup from "../popup";
export default defineComponent({
  name: "Drawer",
  mixins: [slotsMixins],
  components: {
    Iconfont,
    FlexItem,
    Flex,
    Button,
    Popup
  },
  model: {
    prop: "visible",
    event: "input"
  },
  props: {
    fitsContent: {
      type: Boolean,
      default: false
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false,
    },
    placement: {
      type: String,
      default: "bottom",
    },
    maskClosable: {
      type: Boolean,
      default: true,
    },
    closable: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "标题"
    },
    submitButtonText: {
      type: String,
      default: "提交"
    },
    cancelButtonText: {
      type: String,
      default: "取消"
    },
    confirmButtonText: {
      type: String,
      default: "确定"
    },
    mask: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: false
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
    };
  },
  methods: {
    close() {
      this.$emit("input", false);
    },
    handleOnSubmit() {
      this.$emit("submit");
    },
    handleButtonClick(type) {
      if (type === "cancel") {
        this.close();
        this.$emit("buttonClick", type);
      } else if (type === "confirm") {
        this.$emit("buttonClick", type);
      }
    },
    createButton(h, text, type) {
      if (this.closable) {
        return [];
      } else {
        return h("span", {
          on: { click: () => { this.handleButtonClick(type) } }
        }, [text]);
      }
    },
    createCloseIcon(h) {
      if (this.closable) {
        return h("span", { class: ["yn-drawer-close"] }, [
          h(genComponentName("iconfont"), { props: { name: "close", size: "12" }, nativeOn: { click: this.close } }, [])
        ]);
      } else {
        return [];
      }
    },
    handleInput(e) {
      this.$emit("input", e);
    },
    handleBeforeEnter() {
      this.$emit("afterVisibleChange", "beforeEnter");
    },
    handleAfterEnter() {
      this.$emit("afterVisibleChange", "afterEnter");
    },
    handleBeforeLeave() {
      this.$emit("afterVisibleChange", "beforeLeave");
    },
    handleAfterLeave() {
      this.$emit("afterVisibleChange", "afterLeave");
    },
    createFooter(h) {
      const customFooter = this.slots("footer");
      // console.log(customFooter);
      // if (customFooter.length > 0) {
      //   return [customFooter];
      // }
      const hasCustomFooter = customFooter.length > 0;
      const footer = hasCustomFooter ? customFooter : h(genComponentName("button"), {
            class: ["yn-drawer-submit"],
            props: { type: "primary", size: "large" },
            on: { click: this.handleOnSubmit }
          }, [
            this.submitButtonText
          ]);
      if (this.showFooter || customFooter.length > 0) {
        return h(genComponentName("flex-item"), {
          ref: "header",
          class: ["yn-drawer-footer"]
        }, [
          footer
        ])
      }
    }
  },
  render(h) {
    return h("div", { class: ["yn-drawer", this.mask ? "" : "no-mask"] }, [
      h(genComponentName("popup"), {
        directives: [{ name: "show", value: this.visible }],
        props: {
          position: this.placement,
          closeOnClickModal: this.maskClosable
        },
        style: {
          ...this.popupStyle
        },
        on: {
          input: this.handleInput,
          beforeEnter: this.handleBeforeEnter,
          afterEnter: this.handleAfterEnter,
          beforeLeave: this.handleBeforeLeave,
          afterLeave: this.handleAfterLeave,
        }
      }, [
        h(genComponentName("flex"), {
          class: ["yn-drawer-wrapper"],
          props: { flexDirection: "column", justifyContent: "spaceBetween" }
        }, [
          h(genComponentName("flex-item"), {
            ref: "header", class: ["yn-drawer-header"]
          }, [
            h(genComponentName("flex"), { class: ["yn-drawer-header-inner"], props: { justifyContent: "spaceBetween" } }, [
              h(genComponentName("flex-item"), { class: ["yn-drawer-cancel"] }, [
                this.createButton(h, this.cancelButtonText, "cancel")
              ]),
              h(genComponentName("flex-item"), { class: ["yn-drawer-title-box"] }, [
                h("h3", { class: ["yn-drawer-title"] }, this.title)
              ]),
              h(genComponentName("flex-item"), { class: ["yn-drawer-confirm"] }, [
                this.createCloseIcon(h),
                this.createButton(h, this.confirmButtonText, "confirm")
              ])
            ])
          ]),
          h(genComponentName("flex-item"), {
            class: ["yn-drawer-body"],
            props: { flex: 1 }
          }, [
            h("div", { class: ["yn-drawer-content", this.fitsContent ? "fits-content" : ""] }, [
              this.slots()
            ])
          ]),
          this.createFooter(h)
        ])
      ])
    ]);
  },
});
