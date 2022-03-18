<template>
  <div class="dialog-page">
    <h3>基本用法</h3>
    <yn-button type="text" @click="dialogVisible = true">点击打开 Dialog</yn-button>
    <Yn-dialog :visible.sync="dialogVisible">
      <span slot="footer">
        <yn-button @click="dialogVisible = false">取消</yn-button>
        <yn-button type="primary" @click="dialogVisible = false">确定</yn-button>
      </span>
    </Yn-dialog>
    <h3>嵌套的Dialog</h3>
    <yn-button type="text" @click="outerVisible = true">点击打开外层Dialog</yn-button>
    <Yn-dialog :visible.sync="outerVisible" title="外层Dialog">
      <Yn-dialog :visible.sync="innerVisible" title="内层Dialog">
      </Yn-dialog>
      <span slot="footer">
        <yn-button @click="outerVisible = false">取消</yn-button>
        <yn-button type="primary" @click="innerVisible = true">打开内侧Dialog</yn-button>
      </span>
    </Yn-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import "./style/index.scss";
import { Component } from "vue-property-decorator";
@Component({
  name: "dialogPage"
})
export default class ExDialog extends Vue {
  dialogVisible = false;
  outerVisible = false;
  innerVisible = false;
}
</script>