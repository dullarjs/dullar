
import PopupManager from "./popup/popupManger";
import { Vue, Options, prop, mixins } from "vue-class-component";
import PopperJS from "@/utils/popper";
import { AnyObject } from "@/types";
import { on, off, addClass } from "@/utils/dom";
const stop = (e: Event) => e.stopPropagation();
class Props {
  visible = prop<boolean>({ default: false })
  width = prop<number>({ default: 0 })
  placement = prop<string>({ default: "bottom" }) // "top", "bottom", "left", "right"
  visibleArrow = prop<boolean>({ default: true })
  appendToBody = prop<boolean>({ default: true })
  offset = prop<number>({ default: 0 })
  arrowOffset = prop<number>({ default: 0 })
}
@Options({
  name: "Popup",
  watch: {
    visibleArrow: {
      immediate: true,
      handler(n: boolean) {
        this.visibleArrowData = n;
      }
    },
    visible(n: boolean) {
      this.showPopper = n;
    },
    showPopper(n: boolean) {
      if (n) {
        this.updatePopper();
        this.$nextTick(() => {
          this.updatePopper();
        });
      }
    }
  }
})
export default class Popup extends mixins(Vue).with(Props) {

  visibleArrowData = true;
  showPopper = false;
  arrowAppended = false;
  currentPlacement = "";
  popperJS: AnyObject | undefined | null = undefined;
  popperElm: HTMLElement | undefined = undefined;
  referenceElm: HTMLElement | undefined = undefined;

  createPopper() {
    this.currentPlacement = this.currentPlacement || this.placement;
    if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)) {
      return;
    }
    const options: AnyObject = {};
    const popper = this.popperElm = (this.popperElm || this.$refs.popper) as HTMLElement;
    let reference = this.referenceElm = (this.referenceElm || this.$refs.reference) as HTMLElement;

    if (!reference &&
      this.$slots.reference &&
      Array.isArray(this.$slots.reference()) &&
      this.$slots.reference()[0]) {
      reference = this.referenceElm = this.$slots.reference()[0].el as HTMLElement;
    }

    if (!popper || !reference) return;
    if (!this.visibleArrowData) {
      addClass(popper, "is-noarrow");
    }
    if (this.visibleArrowData) this.appendArrow(popper);
    if (this.appendToBody) document.body.appendChild(this.popperElm);
    if (this.popperJS && this.popperJS.destroy) {
      this.popperJS.destroy();
    }

    options.placement = this.currentPlacement;
    options.offset = this.offset;
    options.arrowOffset = this.arrowOffset;
    this.popperJS = new PopperJS(reference, popper, options);
    this.popperJS.onCreate(() => {
      this.$emit('created', this);
      this.$nextTick(this.updatePopper);
    });
    if (typeof options.onUpdate === 'function') {
      this.popperJS.onUpdate(options.onUpdate);
    }
    this.popperJS._popper.style.zIndex = PopupManager.nextZIndex();
    this.popperElm.addEventListener('click', stop);
  }

  updatePopper() {
    const popperJS = this.popperJS;
    if (popperJS) {
      popperJS.update();
      if (popperJS._popper) {
        popperJS._popper.style.zIndex = PopupManager.nextZIndex();
      }
    } else {
      this.createPopper();
    }
  }
  appendArrow(ele: HTMLElement) {
    if (this.arrowAppended) return;
    const arrow = document.createElement("div");
    arrow.setAttribute("class", "popper__arrow");
    arrow.setAttribute('x-arrow', '');
    ele.appendChild(arrow);
    this.arrowAppended = true;
  }
  doDestroy(forceDestroy: boolean) {
    /* istanbul ignore if */
    if (!this.popperJS || (this.showPopper && !forceDestroy)) return;
    this.popperJS.destroy();
    this.popperJS = null;
  }
  handleResize() {
    this.updatePopper();
  }
  mounted() {
    on(document, "resize", this.handleResize)
  }
  beforeDestroy() {
    this.doDestroy(true);
    off(document, "resize", this.handleResize)
    if (this.popperElm && this.popperElm.parentNode === document.body) {
      this.popperElm.removeEventListener('click', stop);
      document.body.removeChild(this.popperElm);
    }
  }
}
