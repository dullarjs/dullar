<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-show="visible"
      class="el-dialog__wrapper"
      :style="style"
      @click.self="handleWrapperClick"
    >
      <div class="el-dialog">
        <div class="el-dialog__header">
          <span class="el-dialog__title">{{title}}</span>
        </div>
        <div class="el-dialog__body">
          <slot>
            <span>这是一段信息</span>
          </slot>
        </div>
        <div class="el-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Mixins, Prop  } from "vue-property-decorator";
import Popup from "@/utils/popup";
import "./style/index.scss";
import { AnyObject } from "@/types";
@Component({
  name: "Dialog"
})
export default class Dialog extends Mixins(Vue, Popup) {
  @Prop({
    type: Boolean,
    default: true
  })
  modal = true;
  @Prop({
    type: Boolean,
    default: true
  })
  modalAppendToBody = true;
  @Prop({
    type: Boolean,
    default: true
  })
  appendToBody!: boolean;
  @Prop({
    type: Boolean,
    default: true
  })
  closeOnClickModal = true;
  @Prop({
    type: String,
    default: ""
  })
  top!: string
  @Prop({
    type: String,
    default: ""
  })
  width!: string
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
    this.handClose();
  }
  handClose() {
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