<template>
  <div class="popconfirm-page">
    <h3>基础用法</h3>
    <yn-popconfirm
      title="这是一段内容确定删除吗？"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <template #reference>
        <yn-button>删除</yn-button>
      </template>
    </yn-popconfirm>
    <h3>自定义</h3>
    <yn-popconfirm
      confirm-button-text='好的'
      cancel-button-text='不用了'
      title="这是一段内容确定删除吗？"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <template #reference>
        <yn-button>删除</yn-button>
      </template>
    </yn-popconfirm>
  </div>
</template>
<script lang="ts">
import "./style/index.scss";
import { Vue, Options } from "vue-class-component";
@Options({
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