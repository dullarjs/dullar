<template>
  <div>
    <h2>Yn-checkbox</h2>
    <ul>
      <li>
        <Yn-checkbox v-model="checked" @change="handleClick"></Yn-checkbox>
        <span>当前状态{{ checked }}</span>
      </li>
      <li>
        <Yn-checkbox v-model="checked" disabled @change="handleClick"></Yn-checkbox>
        <span>此状态不可修改{{ checked }}</span>
      </li>
      <li>
        <Yn-checkbox v-model="value"></Yn-checkbox>
        <span>当前状态{{ value }}</span>
      </li>
      <li>
        <Yn-checkbox v-model="value" disabled></Yn-checkbox>
        <span>此状态不可修改{{ value }}</span>
      </li>
    </ul>
    <h2>下面是动态循环的案例</h2>
    <Yn-checkbox :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAll(list)"
    ></Yn-checkbox>
    <span>全选</span>
    <ul>
      <li class="outer-box" @click="handleItemClick(item, list)" v-for="(item, key) in list" :key="key">
        <Yn-checkbox disableClick v-model="item.status"></Yn-checkbox>
        <span>支持整行点击</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { AnyObject } from "@/types";
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({
  name: "CheckboxPage"
})
export default class CheckboxPage extends Vue {
  isIndeterminate = false;
  checkAll = false;
  checked = false;
  value = true;
  list = [
    { status: false },
    { status: false },
    { status: false },
    { status: false },
    { status: true },
    { status: false },
    { status: false },
    { status: false },
    { status: false },
  ];
  handleClick(e: Event) {
    console.log("改变状态了", e);
  }
  handleItemClick(item: AnyObject, list: AnyObject[]) {
    console.log("item", item);
    item.status = !item.status;
    let checkedCount = list.filter(item => item.status).length;
    this.checkAll = checkedCount === list.length;
    this.isIndeterminate = checkedCount > 0 && checkedCount < list.length;
  }
  handleCheckAll(list: AnyObject[]) {
    list.map(item => {
      item.status = this.checkAll;
    });
    this.isIndeterminate = false;
  }
  initIsIndeterminate() {
    let checkedCount = this.list.filter(item => item.status).length;
    this.checkAll = checkedCount === this.list.length;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length;
  }
  created() {
    this.initIsIndeterminate();
  }
}
</script>
<style type="text/css" scoped="scoped">
  ul {
    list-style: none;
  }
  ul li {
    margin: 5px 0;
  }
  .outer-box {
    background: #eee;
  }
</style>
