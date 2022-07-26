<template>
  <div class="message-page">
    <h3>基础用法</h3>
    <yn-button type="text" @click="open">点击显示message</yn-button>
    <h3>不同状态</h3>
    <yn-button  @click="open()">默认</yn-button>
    <yn-button  @click="open({type: 'success'})">成功</yn-button>
    <yn-button  @click="open({type: 'warning'})">警告</yn-button>
    <yn-button  @click="open({type: 'error'})">错误</yn-button>
  </div>
</template>
<script lang="ts">
import "./style/index.scss";
import { Vue, Options } from "vue-class-component";
import { AnyObject } from "@/types";

@Options({
  name: "messagePage"
})
export default class MessagePage extends Vue {
  open(option: AnyObject = {}) {
    // this.dialogVisible = true;
    option.message = "这是一条消息提示"
    this.Message(option);
  }
}
</script>