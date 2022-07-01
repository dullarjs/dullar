<template>
  <span
    class="yn-popover__wrapper"
  >
    <transition
      :name="transition"
      @before-enter="beforeEnter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @after-leave="afterLeave"
    >
      <div
        class="yn-popper"
        ref="popper"
        v-show="visible"
        :style="style"
        :class="popperClass"
      >
        <div class="yn-popover__title" v-if="title">
          {{ title }}
        </div>
        <div class="yn-popover__content">
          <slot>
            <span>这是popover弹框,这是popover弹框,这是popover弹框</span>
          </slot>
        </div>
      </div>
    </transition>
    <span
      class="yn-popover__reference-wrapper"
      ref="wrapper"
    >
      <slot name="reference"></slot>
    </span>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Mixins, Prop } from "vue-property-decorator";
import "./style/index.scss";
import "@/theme/transition.scss";
import { AnyObject } from "../../types";
import { on, off, addClass } from "../../utils/dom";
import Popper from "../../utils/vue-popper";

@Component({
  name: "Popover"
})
export default class Popover extends Mixins(
  Vue,
  Popper
) {
  static componentName = "YnPopover";
  _timer = 0;

  @Prop({
    type: String,
    default: "click"
  })
  trigger!: string
  @Prop({
    type: String,
    default: "fade-in-linear"
  })
  transition!: string;
  @Prop({
    type: String,
    default: ""
  })
  title!: string;
  @Prop({
    type: Array,
    default: () => {
      return [];
    }
  })
  popperClass!: string[];
  @Prop({
    type: Number,
    default: 200
  })
  closeDelay!: number;

  get style() {
    const style: AnyObject = {};
    if (this.width) style.width = this.width + "px";
    return style;
  }

  toggle() {
    this.$emit("update:visible", !this.visible);
  }
  handleDocumentClick(e: Event) {
    const domPop = this.$refs.popper as HTMLElement;
    const domReference = this.referenceElm;
    const target = e.target as HTMLElement;
    if (!this.$el || this.$el.contains(target) ||
      !domPop || domPop.contains(target) ||
      !domReference || domReference.contains(target)) {
        // 外部点击事件传入 popover，则popover组件不做任何处理
      return;
    } else {
      this.$emit("update:visible", false);
    }
  }
  handleMouseEnter() {
    clearTimeout(this._timer);
    this.$emit("update:visible", true);
  }
  handleMouseLeave() {
    clearTimeout(this._timer);
    if(this.closeDelay) {
      this._timer = setTimeout(() => {
        this.$emit("update:visible", false);
      }, this.closeDelay);
    } else {
      this.$emit("update:visible", false);
    }
  }
  beforeEnter() {
    this.$emit("beforeEnter");
  }
  afterEnter() {
    this.$emit("opend");
  }
  beforeLeave() {
    this.$emit("beforeLeave");
  }
  afterLeave() {
    this.$emit("close");
  }
  mounted() {
    let reference = this.referenceElm = this.$refs.reference as HTMLElement;
    let poper = this.$refs.popper as HTMLElement;

    if (!reference && (this.$refs.wrapper as HTMLElement).children) {
      reference = this.referenceElm = (this.$refs.wrapper as HTMLElement).children[0] as HTMLElement;
      addClass(reference, "yn-popover__reference");
    }
    switch(this.trigger) {
      case "click": {
        on(reference, "click", this.toggle);
        on(document, "click", this.handleDocumentClick);
        break;
      }
      case "hover": {
        on(reference, "mouseenter", this.handleMouseEnter);
        on(poper, "mouseenter", this.handleMouseEnter);
        on(reference, "mouseleave", this.handleMouseLeave);
        on(poper, "mouseleave", this.handleMouseLeave);
        break;
      }
    }
  }
  beforeDestroy() {
    let reference = this.referenceElm as HTMLElement;
    off(reference, "click", this.toggle);
    off(document, "click", this.handleDocumentClick);
  }
}
</script>
