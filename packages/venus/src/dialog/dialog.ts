/*
* @Author: Just be free
* @Date:   2020-09-23 16:16:46
* @Last Modified by:   Just be free
* @Last Modified time: 2022-07-19 16:45:53
* @E-mail: justbefree@126.com
*/
import Venus, { Options, mixins, prop } from "../component/Venus";
import { Transition, h, withDirectives, vShow, VNode } from "vue";
import { addClass } from "../utils/dom";
import { isPromise } from "@dullar/cube";
import VButton from "../button";
class Props {
  beforeOpen?: Function
  opened?: Function
  beforeClose?: Function
  closed?: Function
  modelValue = prop<boolean>({ default: false })
  className?: string|number
  zIndex = prop<string|number>({ default: 2 })
  closeModelOnClick = prop<boolean>({ default: false })
  message?: string
  title?: string
  showCancelButton = prop<boolean>({ default: true })
  cancelButtonText = prop<string>({ default: "取消" })
  showConfirmButton = prop<boolean>({ default: true })
  confirmButtonText = prop<string>({ default: "确定" })
  textHideWhenLoading = prop<boolean>({ default: false })
}
@Options({
  emits: ["update:modelValue", "modal-click", "before-enter", "after-enter", "before-leave", "after-leave", "button-click"],
  name: "VDialog"
})
export default class VDialog extends mixins(Venus).with(Props) {
  public static componentName = "VDialog";
  public bodyOverflow = "";
  public events = {} as any;
  public renderedAsComponent = true;
  public show = false;
  public action = "";
  public loading = false;
  handleBeforeEnter(node: any) {
    this.$emit("before-enter", node);
    this.beforeOpen && this.beforeOpen(this.action);
    this.bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const parent = node.parentNode;
    const modal = document.createElement("div");
    modal.style.zIndex = `${Number(this.zIndex) - 1}`;
    modal.onclick = () => {
      if (this.closeModelOnClick) {
        if (this.renderedAsComponent) {
          this.$emit("update:modelValue", false);
        } else {
          this.show = false;
        }
      } else {
        this.$emit("modal-click");
      }
    };
    addClass(modal, "v-qdialog-modal");
    parent.insertBefore(modal, node);
    // this.$emit("before-enter");
    this.events["doClose"] = () => {
      parent.removeChild(modal);
      document.body.style.overflow = this.bodyOverflow;
    };
  }
  close() {
    this.events["doClose"]();
    delete this.events["doClose"];
    if (!this.renderedAsComponent) {
      this.removeDOM();
    }
  }
  removeDOM() {
    const el = this.getDomTree() as HTMLElement;
    const parent = el.parentNode as HTMLElement;
    parent.removeChild(el);
  }
  handleAfterEnter(node: any) {
    this.$emit("after-enter", node);
    this.opened && this.opened(this.action);
  }
  handleBeforeLeave(node: any) {
    this.$emit("before-leave", node);
    // this.beforeClose && (typeof this.beforeClose === "function") && this.beforeClose();
  }
  handleAfterLeave(node: any) {
    this.$emit("after-leave", node);
    this.close();
    this.closed && this.closed(this.action);
  }
  getLoadingStatus(e: string): boolean {
    return this.loading && this.action === e;
  }
  getDisableStatus(e: string): boolean {
    return this.loading && this.action !== e;
  }
  handleButtonClick(e: string): void {
    this.action = e;
    const { beforeClose } = this;
    if (beforeClose) {
      const promise = beforeClose(e);
      if (isPromise(promise)) {
        this.loading = true;
        promise.then((res: any) => {
          this.show = false;
          this.$emit("update:modelValue", false);
          this.$emit("button-click", e, res);
        });
      } else {
        this.show = false;
        this.$emit("update:modelValue", false);
        this.$emit("button-click", e);
      }
    } else {
      this.$emit("button-click", e);
      this.show = false;
      this.$emit("update:modelValue", false);
    }
  }
  setVisible(val: boolean): void {
    this.show = val;
  }
  setRenderedAsComponent(val: boolean): void {
    this.renderedAsComponent = val;
  }
  genButtons(): Array<VNode> {
    const buttons = [];
    if (this.showCancelButton) {
      buttons.push(
        h(
          VButton,
          {
            textHideWhenLoading: this.textHideWhenLoading,
            size: "large",
            disabled: this.getDisableStatus("cancel"),
            loading: this.getLoadingStatus("cancel"),
            onClick: this.handleButtonClick.bind(this, "cancel"),
            class: ["v-dialog-cancel-button"]
          },
          { default: () => this.cancelButtonText }
        )
      );
    }
    if (this.showConfirmButton) {
      const className = buttons.length === 1 ? "vertical-line" : "";
      buttons.push(
        h(
          VButton,
          {
            textHideWhenLoading: this.textHideWhenLoading,
            size: "large",
            disabled: this.getDisableStatus("confirm"),
            loading: this.getLoadingStatus("confirm"),
            onClick: this.handleButtonClick.bind(this, "confirm"),
            class: ["v-dialog-confirm-button", className]
          },
          { default: () => this.confirmButtonText }
        )
      );
    }
    return buttons;
  }
  render() {
    const buttons = this.genButtons();
    const className = Array.isArray(this.className) ? this.className : [this.className];
    return h(Transition, {
      name: "v-dialog-bounce",
      onBeforeEnter: this.handleBeforeEnter,
      onAfterEnter: this.handleAfterEnter,
      onBeforeLeave: this.handleBeforeLeave,
      onAfterLeave: this.handleAfterLeave
    }, { default: () => [
      withDirectives(h(
        "div",
        {
          class: ["v-dialog", ...className],
          style: { zIndex: this.zIndex }
        },
        { default: () => [
            this.title && (
              h("div", { class: ["v-dialog-title"] }, { default: () => this.title })
            ),
            h("div", { class: "v-dialog-content" }, { default: () => [this.renderedAsComponent && this.getSlots() || this.message] }),
            buttons.length > 0 && (
              h("div", { class: ["v-dialog-buttons"] }, { default: () => buttons })
            )
          ]
        }
      ), [[vShow, this.modelValue || this.show]])
    ] });
  }
}
