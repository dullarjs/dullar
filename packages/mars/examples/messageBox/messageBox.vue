<template>
  <div class="message-box-page">
    <h3>基础用法</h3>
    <yn-button type="text" @click="open"></yn-button>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import "./style/index.scss";
import { Component } from "vue-property-decorator";
@Component({
  name: "messageBoxPage"
})
export default class MessageBoxPage extends Vue {
  open() {
    this.$msgbox({
      title: "消息",
      message: "我是msgbox",
      beforeClose: () => {
        console.log("beforeClose");
      }
    })
  }
}
</script>