<template>
  <div class="select-page">
    <h3>基本用法</h3>
    <yn-select v-model="value" @input="handleInput">
      <yn-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </yn-option>
    </yn-select>
    <h3>基本用法测试</h3>
    <yn-select v-model="value" @input="handleInput">
      <yn-option
        v-for="item in options1"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </yn-option>
    </yn-select>
    <h3>placeholder</h3>
    <yn-select
      v-model="value3"
      :placeholder="placeholder"
      size="small"
      @input="handleInput"
    >
      <yn-option
        v-for="item in options1"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </yn-option>
    </yn-select>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import "./style/index.scss";
import { Component } from "vue-property-decorator";
import { AnyObject } from "@/types";
@Component({
  name: "selectPage"
})
export default class SelectPage extends Vue {
  value = "选项4";
  value3 = "";
  placeholder="请选择";
  options1: AnyObject[] = [];
  options = [{
    value: '选项1',
    label: '黄金糕'
  }, {
    value: '选项2',
    label: '双皮奶'
  }, {
    value: '选项3',
    label: '蚵仔煎'
  }, {
    value: '选项4',
    label: '龙须面'
  }, {
    value: '选项5',
    label: '北京烤鸭'
  }, {
    value: '选项6',
    label: '湖北省武汉市李记热干面'
  }, {
    value: '选项7',
    label: '豆皮'
  }, {
    value: '选项8',
    label: '天津大麻花'
  }, {
    value: '选项9',
    label: '襄阳牛肉面'
  }];
  handleInput(e: number | string) {
    console.log("e:", e);
  }
  mounted() {
    setTimeout(() => {
      this.options.forEach(item => {
        this.options1.push(item);
      });
    }, 2000);
  }
}
</script>
