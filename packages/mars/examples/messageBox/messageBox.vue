<template>
  <div class="message-box-page">
    <h3>基础用法</h3>
    <yn-button type="text" @click="open">点击显示messageBox</yn-button>
    <h3>带回调</h3>
    <yn-button type="text" @click="open1">点击显示messageBox</yn-button>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import "./style/index.scss";
import { Component } from "vue-property-decorator";
import { AnyObject } from "@/types";

@Component({
  name: "messageBoxPage"
})
export default class MessageBoxPage extends Vue {
  open() {
    // this.dialogVisible = true;
    this.$msgbox({
      title: "消息",
      message: "我是msgbox"
    })
  }
  open1() {
    // this.dialogVisible = true;
    this.$msgbox({
      title: "消息",
      message: "我是msgbox",
      beforeClose: (action: string, ins: AnyObject, done: () => void) => {
        console.log("beforeClose, action:", action);
        done();
      }
    })
    .then((action: string) => {
      console.log("resolve ", action);
    })
    .catch((action: string) => {
      console.log("reject ", action);
    })
  }
}
</script>