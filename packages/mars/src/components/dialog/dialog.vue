<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-show="visible"
      class="yn-dialog__wrapper"
      :style="style"
      @click.self="handleWrapperClick"
    >
      <div class="yn-dialog">
        <div class="yn-dialog__header">
          <span class="yn-dialog__title">{{title}}</span>
          <button class="yn-dialog__headerbtn" @click="handleClose">
            <Icon name="close" class="yn-dialog__close"></Icon>
          </button>
        </div>
        <div class="yn-dialog__body">
          <slot>
            <span>这是一段信息</span>
          </slot>
        </div>
        <div class="yn-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Mixins, Prop  } from "vue-property-decorator";
import Popup from "../../utils/popup";
import Icon from "@/components/icon";
import "./style/index.scss";
import { AnyObject } from "../../types";
@Component({
  name: "Dialog",
  components: {
    Icon
  }
})
export default class Dialog extends Mixins(Vue, Popup) {
  static componentName = "YnDialog";
  @Prop({
    type: Boolean,
    default: true
  })
  appendToBody!: boolean;
  @Prop({
    type: String,
    default: ""
  })
  top!: string;
  @Prop({
    type: String,
    default: ""
  })
  width!: string;
  @Prop({
    type: String,
    default: "提示"
  })
  title!: string;

  get style() {
    let style: AnyObject = {};
    if (this.top) style.marginTop = this.top;
    if (this.width) style.width = this.width;
    return style;
  }
  afterEnter() {
    this.$emit("opened");
  }
  afterLeave() {
    this.$emit("closed");
  }
  handleWrapperClick() {
    if (!this.closeOnClickModal) return;
    this.handleClose();
  }
  handleClose() {
    this.$emit("update:visible", false);
    this.$emit("close", true);
  }
  mounted() {
    if (this.appendToBody) {
      document.body.appendChild(this.$el);
    }
  }
  beforeDestroy() {
    if(this.appendToBody && document.body && this.$el) {
      document.body.removeChild(this.$el);
    }
  }
}
</script>