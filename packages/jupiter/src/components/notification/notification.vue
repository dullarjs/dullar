<template>
  <transition name="notice" @before-leave="destoryNotice">
    <div 
      :class="['message-fade', type ? `message-fade-${type}` : '', center ? 'message-fade-center' : '']" 
      v-show="visable" 
      :style="{top: top+'px'}"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
    <img :src="typeIcon" alt="" height="20px">
    <span>{{message}}</span>
    </div>
  </transition>
</template>
<script lang="ts">
import "./style.scss"
import successIcon from "./images/success.svg";
import errorIcon from "./images/error.svg";
import infoIcon from "./images/info.svg";
import warningIcon from "./images/warning.svg";
import { Vue, Options, prop, mixins } from 'vue-class-component'
class Props {
  message = prop<string>({ default: "" })
  type = prop<string>({ default: "info" })
  center = prop<boolean>({ default: false })
  duration = prop<number>({ default: 3000 })
}
@Options({
  name: "YnNotification",
  watch: {
    visable(newValue: boolean) {
      if (!newValue) {
        this.closeNotice();
      }
    }
  }
})
export default class Notification extends mixins(Vue).with(Props) {
  static componentName = "YnNotification";
  visable = false;
  top = 20;
  onClose = null;
  timer = 0;
  successIcon = successIcon;
  errorIcon = errorIcon;
  infoIcon = infoIcon;
  warningIcon = warningIcon;

  get typeIcon() {
    console.log("notification typeIcon this:", this);
    return (this as any)[`${this.type}Icon`]
  }
  //  离开之前
  destoryNotice(): void {
    // 移除dom元素
    (this as any).$el.parentNode.removeChild(this.$el);
  }
  closeNotice() {
    if (typeof this.onClose === 'function') {
      (this as any).onClose(this);
    }
  }
  clearTimer() {
    clearTimeout(this.timer);
  }
  startTimer() {
    const { duration } = this.$props;
    if (this.timer > 0) {
      this.timer = window.setTimeout(() => {
        this.visable = false;
      }, duration);
    }
  }
  mounted () {
    const { duration } = this.$props;
    this.timer = window.setTimeout(() => {
      this.visable = false;
    }, duration)
  }
}
</script>
