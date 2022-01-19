<template>
  <div>
    <div @click="openMessage">这是一个消息</div>
    <div @click="openMessageSuccess">这是一个好消息</div>
    <div @click="openMessageerror">这是一个坏消息</div>
    <div @click="openMessagewarn">这是一个警告消息</div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { Component } from 'vue-property-decorator'
@Component({
  name: "Notification"
})
export default class Notification extends Vue {
  openMessage() {
    (this as any).$notification({message: "这是一条消息提示"});
  }
  openMessageSuccess() {
    (this as any).$notification({message: "这是一条好消息提示", type: "success", center: false, timer: 3000}); 
  }
  openMessageerror() {
    (this as any).$notification({message: "这是一条坏消息提示", type: "error"}); 
  }
  openMessagewarn() {
    (this as any).$notification({message: "这是一条警告消息提示", type: "warning"}); 
  }
}
</script>
