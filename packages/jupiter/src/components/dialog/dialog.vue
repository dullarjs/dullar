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
        <div class="yn-dialog__header" v-if="showHeader">
          <slot name="header">
            <span class="yn-dialog__title">{{title}}</span>
            <button class="yn-dialog__headerbtn" @click="handleClose">
              <Icon name="close" class="yn-dialog__close"></Icon>
            </button>
          </slot>
        </div>
        <div class="yn-dialog__body" :class="{'is-overflowy': bodyOverflowY}">
          <slot>
            <span>这是一段信息</span>
          </slot>
        </div>
        <div class="yn-dialog__footer" v-if="showFooter">
          <slot name="footer">
            <yn-button size="small"
              @click="handleCancel"
              v-if="cancelBtnShow"
            >{{ cancleBtnName }}</yn-button>
            <yn-button size="small" type="primary"
              @click="handleConfirm"
              v-if="confirmBtnShow"
            >{{ confirmBtnName }}</yn-button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { Vue, Options, mixins, prop } from "vue-class-component";
import Popup from "../../utils/popup";
import Icon from "@/components/icon";
import "./style/index.scss";
import { AnyObject } from "../../types";
class Props {
  appendToBody = prop<boolean>({ default: true })
  top = prop<string>({ default: "" })
  width = prop<string>({ default: "" })
  title = prop<string>({ default: "提示" })
  cancleBtnName = prop<string>({ default: "取消" })
  confirmBtnName = prop<string>({ default: "确定" })
  cancelBtnShow = prop<boolean>({ default: true })
  confirmBtnShow = prop<boolean>({ default: true })
  showHeader = prop<boolean>({ default: true })
  showFooter = prop<boolean>({ default: true })
  bodyOverflowY = prop<boolean>({ default: true })
}
@Options({
  name: "YnDialog",
  components: {
    Icon
  }
})
export default class Dialog extends mixins(Vue, Popup).with(Props) {
  static componentName = "YnDialog";

  get style() {
    const style: AnyObject = {};
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
  handleCancel() {
    this.$emit("cancel");
    this.handleClose();
  }
  handleConfirm() {
    this.$emit("confirm");
    this.handleClose();
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
