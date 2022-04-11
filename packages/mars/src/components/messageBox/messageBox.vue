<template>
  <transition
    name="dialog-fade"
  >
    <div
      v-show="visible"
      class="yn-message-box-wrapper"
      @click.self="handleWrapperClick"
    >
      <div class="yn-message-box">
        <div class="yn-message-box__header">
          <div class="yn-message-box__title">
            {{ title }}
          </div>
          <button class="yn-message-box__headerbtn" @click="handleClose">
            <Icon name="close" class="yn-message-box__close"></Icon>
          </button>
        </div>
        <div class="yn-message-box__content">
          {{ message }}
        </div>
        <div class="yn-message-box__action">
          <Button v-show="showCancelButton" size="mini" @click="handleCancel">{{ cancelButtonText }}</Button>
          <Button v-show="showConfirmButton" type="primary" size="mini" @click="handleConfirm">{{ confirmButtonText }}</Button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import "./style/index.scss";
import Vue from 'vue'
import { Component, Mixins } from "vue-property-decorator";
import Button from "@/components/button";
import Popup from "../../utils/popup";
import Icon from "@/components/icon";
import { Callback } from "@/types";
@Component({
  name: "MessageBox",
  components: {
    Icon,
    Button
  }
})
export default class MessageBox extends Mixins(Vue, Popup){
  static componentName = "YnMessageBox";

  action = '';
  callback: null | Callback = null;
  showConfirmButton = true;
  showCancelButton = true;
  confirmButtonText = '确定';
  cancelButtonText = '取消';
  message = "";
  title = "";

  handleClose() {
    this.handAction("close");
  }
  handleConfirm() {
    this.handAction("confirm");
  }
  handleCancel() {
    this.handAction("cancel");
  }
  handleWrapperClick() {
    if (!this.closeOnClickModal) return;
    this.handAction("close");
  }
  handAction(action: string) {
    this.action = action;
    if (typeof this.beforeClose === 'function') {
      this.beforeClose(action, this, this.doClose);
    } else {
      this.doClose();
    }
  }
  doClose() {
    this.visible = false;
    if (this.action && this.callback) this.callback(this.action);
  }
  beforeDestroy() {
    if(document.body && this.$el) {
      document.body.removeChild(this.$el);
    }
  }
}
</script>
