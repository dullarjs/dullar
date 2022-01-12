<template>
  <span
    class="el-popover__wrapper"
  >
    <transition
      :name="transition"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
    >
      <div
        class="el-popover"
        ref="popper"
        v-show="visible"
        :style="style"
      >
        <div class="el-popover__title" v-if="title">
          {{ title }}
        </div>
        <div class="el-popover__content">
          <slot>
            <span>这是popover弹框,这是popover弹框,这是popover弹框</span>
          </slot>
        </div>
      </div>
    </transition>
    <span
      class="el-reference"
      ref="reference"
    >
      <slot name="reference"></slot>
    </span>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Mixins, Prop, Watch  } from "vue-property-decorator";
import "./style/index.scss";
import "@/theme/transition.scss";
import { AnyObject } from "@/types";
import { on, off } from "@/utils/dom";
import Popper from "@/utils/vue-popper";

@Component({
  name: "Popper"
})
export default class Dialog extends Mixins(
  Vue,
  Popper
) {
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
  title!: string
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
    const domReference = this.$refs.reference as HTMLElement;
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
    this.$emit("update:visible", true);
  }
  handleMouseLeave() {
    this.$emit("update:visible", false);
  }
  afterEnter() {
    this.$emit("opend");
  }
  afterLeave() {
    this.$emit("close");
  }
  mounted() {
    let reference = this.$refs.reference as HTMLElement;
    let poper = this.$refs.popper as HTMLElement;
    switch(this.trigger) {
      case "click": {
        on(reference, "click", this.toggle);
        on(document, "click", this.handleDocumentClick);
        break;
      }
      case "hover": {
        on(reference, "mouseenter", this.handleMouseEnter);
        on(poper, "mounseenter", this.handleMouseEnter);
        on(reference, "mouseleave", this.handleMouseLeave);
        on(poper, "mounseleave", this.handleMouseLeave);
        break;
      }
    }
  }
  beforeDestroy() {
    let reference = this.$refs.reference as HTMLElement;
    off(reference, "click", this.toggle);
    off(document, "click", this.handleDocumentClick);
  }
}
</script>