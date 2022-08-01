<template>
  <transition name="yn-message-fade"
    @before-leave="onClose"
    @after-leave="$emit('destroy')">
    <div class="yn-message"
      v-show="visible"
      :class="[
        showClose ? 'is-closable': '',
        typeClassName
      ]"
      :style="style"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <p class="yn-message__content">{{ message }}</p>
      <Icon v-if="showClose" name="close" class="yn-message__close" @click.native="handleClose"></Icon>
    </div>
  </transition>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import Icon from "@/components/icon";
import "./style/index.scss";
import { AnyObject, Callback } from '@/types';
@Options({
  name: "YnMessage",
  components: {
    Icon
  }
})
export default class Message extends Vue{
  static componentName = "YnMessage";
  timer!: number;
  offset = 20;
  showClose = true;
  duration = 3000;
  visible = false;
  message = "";
  type = "info"; // "success" | "warning" | "error" | "info"
  onClose: null | Callback = null;

  get style() {
    const style: AnyObject = {}
    style.top = this.offset + "px";
    return style;
  }
  get typeClassName() {
    let type = "info";
    if (["success", "warning", "error"].includes(this.type)) {
      type = this.type;
    }
    return  `yn-message--${type}`;
  }

  clearTimer() {
    clearTimeout(this.timer);
  }
  startTimer() {
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
       this.visible && this.close();
      }, this.duration);
    }
  }
  close() {
    this.visible = false;
    this.onClose && typeof this.onClose === "function" && this.onClose();
  }
  handleClose() {
    this.close();
  }
  mounted() {
   this.startTimer();
  }
  beforeDestroy() {
    document.body.removeChild(this.$el);
  }
}
</script>
