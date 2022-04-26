<template>
  <div class="dialog-page">
    <h3>基本用法</h3>
    <yn-button type="text" @click="dialogVisible1 = true">点击打开 Dialog</yn-button>
    <Yn-dialog :visible.sync="dialogVisible1" confirmBtnName="提交行程">
    </Yn-dialog>
    <h3>自定义底部按钮</h3>
    <yn-button type="text" @click="dialogVisible2 = true">点击打开 Dialog</yn-button>
    <Yn-dialog :visible.sync="dialogVisible2" title="自定义">
      <div class="dialog-content"></div>
      <span slot="footer">
        <yn-button size="small" @click="dialogVisible2 = false">关闭</yn-button>
        <yn-button size="small" type="primary" @click="dialogVisible2 = false">确定</yn-button>
      </span>
    </Yn-dialog>
    <h3>body不滑动，内部元素滑动</h3>
    <yn-button type="text" @click="dialogVisible3 = true">点击打开 Dialog</yn-button>
    <Yn-dialog :visible.sync="dialogVisible3" :bodyOverflowY="false">
      <div class="content">
        <p>人员列表</p>
        <div class="user-list">
          <ul>
            <li v-for="(i, index) in userList" :key="index">{{i}}</li>
          </ul>
        </div>
      </div>
    </Yn-dialog>
    <h3>嵌套的Dialog</h3>
    <yn-button size="small" type="text" @click="outerVisible = true">点击打开外层Dialog</yn-button>
    <Yn-dialog :visible.sync="outerVisible" title="外层Dialog">
      <Yn-dialog :visible.sync="innerVisible" title="内层Dialog">
      </Yn-dialog>
      <span slot="footer">
        <yn-button size="small" @click="outerVisible = false">取消</yn-button>
        <yn-button size="small" type="primary" @click="innerVisible = true">打开内侧Dialog</yn-button>
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
  dialogVisible1 = false;
  dialogVisible2 = false;
  dialogVisible3 = false;
  outerVisible = false;
  innerVisible = false;
  get userList() {
    const list = [];
    for(let i = 0; i < 100; i++) {
      list.push('xx' + i);
    }
    return list;
  }
}
</script>
