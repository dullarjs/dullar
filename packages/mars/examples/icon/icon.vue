<template>
  <div class="icon-page">
    <h2>字体图标</h2>
    <ul class="icon-block-list">
      <li class="icon-block-list__item">
        <yn-icon name="close"></yn-icon>
        <span>yn-icon-close</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({
  name: "CheckboxPage"
})
export default class CheckboxPage extends Vue {
}
</script>
<style lang="scss" scoped="scoped">
  .icon-page {
    .icon-block-list{
      display: flex;
      .icon-block-list__item{
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
</style>
