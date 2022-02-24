<template>
  <div class="dialog-page">
    <h3>基本用法</h3>
    <button @click="dialogVisible = true">点击打开 Dialog</button>
    <m-dialog :visible.sync="dialogVisible">
      <span slot="footer">
        <button class="btn btn--default" @click="dialogVisible = false">取消</button>
        <button class="btn btn--primary" @click="dialogVisible = false">确定</button>
      </span>
    </m-dialog>
    <h3>嵌套的Dialog</h3>
    <button @click="outerVisible = true">点击打开外层Dialog</button>
    <m-dialog :visible.sync="outerVisible" title="外层Dialog">
      <m-dialog :visible.sync="innerVisible" title="内层Dialog">
      </m-dialog>
      <span slot="footer">
        <button class="btn btn--default" @click="outerVisible = false">取消</button>
        <button class="btn btn--primary" @click="innerVisible = true">打开内侧Dialog</button>
      </span>
    </m-dialog>
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