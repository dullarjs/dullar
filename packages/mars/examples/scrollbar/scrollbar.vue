<template>
  <div class="scrollbar-page">
    <h3>基本用法</h3>
    <div class="scrollbar-oute-wrap">
      <yn-scrollbar
        wrapClass="yn-dropdown__wrap"
        viewClass="yn-dropdown-view"
      >
        <ul>
          <li v-for="(item, index) in options" :key="index">
            {{ item.label }}
          </li>
        </ul>
      </yn-scrollbar>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import "./style/index.scss";
import { Component } from "vue-property-decorator";
@Component({
  name: "scrollbarPage"
})
export default class ScrollbarPage extends Vue {
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
  }];
}
</script>