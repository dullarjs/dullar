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
import Vue from "vue"
import successIcon from "./images/success.svg";
import errorIcon from "./images/error.svg";
import infoIcon from "./images/info.svg";
import warningIcon from "./images/warning.svg";
import { Component, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: "Notification"
})
export default class Notification extends Vue {
  static componentName = "YnNotification";
  visable = false;
  top = 20;
  onClose = null;
  timer = 0;
  successIcon = successIcon;
  errorIcon = errorIcon;
  infoIcon = infoIcon;
  warningIcon = warningIcon;
  @Prop({
    type: String,
    default: ""
  })
  message!: string

  // 类型
  @Prop({
    type: String,
    default: "info"
  })
  type!: string

  // 是否居中
   @Prop({
    type: Boolean,
    default: false
  })
  center!: boolean

  // 延时时间
  @Prop({
    type: Number,
    default: 3000
  })
  duration!: number
  @Watch("visable")
  getVisable(newValue: boolean) {
    if (!newValue) {
      this.closeNotice();
    }
  }
  get typeIcon() {
    return (this as any)[`${this.type}Icon`]
  }
  //  离开之前
  destoryNotice(): void {
    this.$destroy();
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
