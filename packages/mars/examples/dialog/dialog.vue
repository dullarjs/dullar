<template>
  <div class="dialog-page">
    <h3>基本用法</h3>
    <button @click="dialogVisible = true">点击打开 Dialog</button>
    <Dialog :visible.sync="dialogVisible">
      <span slot="footer">
        <button class="btn btn--default" @click="dialogVisible = false">取消</button>
        <button class="btn btn--primary" @click="dialogVisible = false">确定</button>
      </span>
    </Dialog>
    <h3>嵌套的Dialog</h3>
    <button @click="outerVisible = true">点击打开外层Dialog</button>
    <Dialog :visible.sync="outerVisible" title="外层Dialog">
      <Dialog :visible.sync="innerVisible" title="内层Dialog">
      </Dialog>
      <span slot="footer">
        <button class="btn btn--default" @click="outerVisible = false">取消</button>
        <button class="btn btn--primary" @click="innerVisible = true">打开内侧Dialog</button>
      </span>
    </Dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import "./style/index.scss";
import { Component } from "vue-property-decorator";
import Dialog from "@/components/dialog";
@Component({
  name: "dialogPage",
  components: {
    Dialog
  }
})
export default class ExDialog extends Vue {
  dialogVisible = false;
  outerVisible = false;
  innerVisible = false;
}
</script>