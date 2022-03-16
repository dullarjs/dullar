<template>
  <div class="popconfirm-page">
    <h3>基础用法</h3>
    <yn-popconfirm
      title="这是一段内容确定删除吗？"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <yn-button slot="reference">删除</yn-button>
    </yn-popconfirm>
    <h3>自定义</h3>
    <yn-popconfirm
      confirm-button-text='好的'
      cancel-button-text='不用了'
      title="这是一段内容确定删除吗？"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <yn-button slot="reference">删除</yn-button>
    </yn-popconfirm>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import "./style/index.scss";
import { Component } from "vue-property-decorator";
@Component({
  name: "popconfirmPage"
})
export default class PopconfirmPage extends Vue {
  handleConfirm() {
    console.log("confirm");
  }
  handleCancel() {
    console.log("cancel");
  }
}
</script>