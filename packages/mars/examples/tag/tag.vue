<template>
  <div class="tag-page">
    <h2>基本用法</h2>
    <yn-tag>标签一</yn-tag>
    <yn-tag type="success">标签二</yn-tag>
    <yn-tag type="info">标签三</yn-tag>
    <yn-tag type="warning">标签四</yn-tag>
    <yn-tag type="danger">标签五</yn-tag>
    <h2>有边线的标签</h2>
    <yn-tag hit>标签一</yn-tag>
    <yn-tag type="success" hit>标签二</yn-tag>
    <yn-tag type="info" hit>标签三</yn-tag>
    <yn-tag type="warning" hit>标签四</yn-tag>
    <yn-tag type="danger" hit>标签五</yn-tag>
    <h2>可删除的标签</h2>
    <yn-tag
      v-for="tag in tags"
      :key="tag.name"
      closable
      :type="tag.type"
      @close="handleClose(tag)"
    >
      {{ tag.name }}
    </yn-tag>
    <h2>不同尺寸</h2>
    <yn-tag size="large" closable>大型标签</yn-tag>
    <yn-tag size="medium" closable>中等标签</yn-tag>
    <yn-tag size="small" closable>小型标签</yn-tag>
    <h2>不同主题色</h2>
    <div class="tag-group">
      <span class="tag-group__title">Dark</span>
      <yn-tag
        v-for="item in tags"
        :key="item.name"
        :type="item.type"
        effect="dark"
      >
        {{ item.name }}
      </yn-tag>
    </div>
    <div class="tag-group">
      <span class="tag-group__title">Plain</span>
      <yn-tag
        v-for="item in tags"
        :key="item.name"
        :type="item.type"
        effect="plain"
      >
        {{ item.name }}
      </yn-tag>
    </div>
  </div>
</template>
<script lang="ts">
import { AnyObject } from "@/types";
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({
  name: "CheckboxPage",
})
export default class CheckboxPage extends Vue {
  tags: AnyObject[] = [
    { name: "标签一", type: "" },
    { name: "标签二", type: "success" },
    { name: "标签三", type: "info" },
    { name: "标签四", type: "warning" },
    { name: "标签五", type: "danger" },
  ];
  handleClose(tag: AnyObject) {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
    }
  }
}
</script>
<style lang="scss" scoped="scoped">
.tag-page{
  .tag-group{
    margin-top: 20px;
    .tag-group__title{
      margin-right: 20px;
    }
  }
}
</style>
