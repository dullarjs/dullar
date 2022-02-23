<template>
  <div>
    <h2>m-iconfont</h2>
    <p>扩展icon</p>
    <m-iconfont name="elm" size="40" @click="handleClick"></m-iconfont>
    <m-iconfont name="eldddm"></m-iconfont>
    <p>内置icon</p>
    <ul>
      <li>
        <m-iconfont name="add-disabled"></m-iconfont>
        <span>add-disabled</span>
      </li>
      <li>
        <m-iconfont name="add"></m-iconfont>
        <span>add</span>
      </li>
      <li>
        <m-iconfont name="back"></m-iconfont>
        <span>back</span>
      </li>
      <li>
        <m-iconfont name="check-mark"></m-iconfont>
        <span>check-mark</span>
      </li>
      <li>
        <m-iconfont name="checkbox-checked-disabled"></m-iconfont>
        <span>checkbox-checked-disabled</span>
      </li>
      <li>
        <m-iconfont name="checkbox-checked"></m-iconfont>
        <span>checkbox-checked</span>
      </li>
      <li>
        <m-iconfont name="checkbox-uncheck-disabled"></m-iconfont>
        <span>checkbox-uncheck-disabled</span>
      </li>
      <li>
        <m-iconfont name="checkbox-uncheck"></m-iconfont>
        <span>checkbox-uncheck</span>
      </li>
      <li>
        <m-iconfont name="clear"></m-iconfont>
        <span>clear</span>
      </li>
      <li>
        <m-iconfont name="close"></m-iconfont>
        <span>close</span>
      </li>
      <li>
        <m-iconfont name="collapsed-default"></m-iconfont>
        <span>collapsed-default</span>
      </li>
      <li>
        <m-iconfont name="collapsed-selected"></m-iconfont>
        <span>collapsed-selected</span>
      </li>
      <li>
        <m-iconfont name="doarrow"></m-iconfont>
        <span>doarrow</span>
      </li>
      <li>
        <m-iconfont name="expanded-default"></m-iconfont>
        <span>expanded-default</span>
      </li>
      <li>
        <m-iconfont name="expanded-selected"></m-iconfont>
        <span>expanded-selected</span>
      </li>
      <li>
        <m-iconfont name="minus-disabled"></m-iconfont>
        <span>minus-disabled</span>
      </li><li>
        <m-iconfont name="minus"></m-iconfont>
        <span>minus</span>
      </li>
      <li>
        <m-iconfont name="radio-off-disabled"></m-iconfont>
        <span>radio-off-disabled</span>
      </li><li>
        <m-iconfont name="radio-off"></m-iconfont>
        <span>radio-off</span>
      </li>
      <li>
        <m-iconfont name="radio-disabled"></m-iconfont>
        <span>radio-disabled</span>
      </li><li>
        <m-iconfont name="radio-on"></m-iconfont>
        <span>radio-on</span>
      </li>
      <li>
        <m-iconfont name="search"></m-iconfont>
        <span>search</span>
      </li><li>
        <m-iconfont name="up-arrow"></m-iconfont>
        <span>up-arrow</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({
  name: "IconfontPage"
})
export default class IconfontPage extends Vue {
  iconfontCollections = [];
  loaded = false;

  handleClick(e: Event) {
    console.log("111111", e);
  }
}
</script>
<style type="text/css" scoped="scoped">
  .flex{
    background: #eee;
  }
  .icname{
    display: none;
  }
  .flex-item{
    width: 50px;
    margin: 10px;
  }
  ul {
    padding: 0;
    list-style: none;
    text-align: center;
  }
   ul li {
    margin: 5px auto;
   }
  ul li span{
    display: inline-block;
    margin: 0 5px;
  }
</style>
