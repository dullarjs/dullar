
import PopupManager from "./popup/popupManger";
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import PopperJS from "@/utils/popper";
import { AnyObject } from "@/types";
import { on, off } from "@/utils/dom";
const stop = (e: Event) => e.stopPropagation();
@Component({
  name: "Popup"
})
export default class Popup extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  visible!: boolean;
  @Prop({
    type: Number,
    default: 0
  })
  width!: number;
  @Prop({
    type: String,
    default: "bottom"
  })
  placement!: string; // "top", "bottom", "left", "right"
  @Prop({
    type: Boolean,
    default: true
  })
  visibleArrow!: boolean;
  @Prop({
    type: Boolean,
    default: true
  })
  appendToBody!: boolean;
  @Prop({
    type: Number,
    default: 0
  })
  offset!: number;
  @Prop({
    type: Number,
    default: 0
  })
  arrowOffset!: number;

  arrowAppended = false;
  currentPlacement = "";
  popperJS: AnyObject | undefined = undefined;
  popperElm: HTMLElement | undefined = undefined;
  referenceElm: HTMLElement | undefined = undefined;

  @Watch("visible")
  onVisible(n: boolean) {
    if (n) {
      this.updatePopper();
      this.$nextTick(() => {
        this.updatePopper();
      });
    }
  }
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
      this.$slots.reference[0]) {
      reference = this.referenceElm = this.$slots.reference[0].elm as HTMLElement;
    }

    if (!popper || !reference) return;
    if (this.visibleArrow) this.appendArrow(popper);
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
  handleResize() {
    this.updatePopper();
  }
  mounted() {
    on(document, "resize", this.handleResize)
  }
  beforeDestroy() {
    off(document, "resize", this.handleResize)
    if (this.popperElm && this.popperElm.parentNode === document.body) {
      this.popperElm.removeEventListener('click', stop);
      document.body.removeChild(this.popperElm);
    }
  }
}