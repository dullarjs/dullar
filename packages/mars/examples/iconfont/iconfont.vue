<template>
  <div>
    <h2>Yn-iconfont</h2>
    <p>扩展icon</p>
    <Yn-iconfont name="elm" size="40" @click="handleClick"></Yn-iconfont>
    <Yn-iconfont name="eldddm"></Yn-iconfont>
    <p>内置icon</p>
    <ul>
      <li>
        <Yn-iconfont name="add-disabled"></Yn-iconfont>
        <span>add-disabled</span>
      </li>
      <li>
        <Yn-iconfont name="add"></Yn-iconfont>
        <span>add</span>
      </li>
      <li>
        <Yn-iconfont name="back"></Yn-iconfont>
        <span>back</span>
      </li>
      <li>
        <Yn-iconfont name="check-mark"></Yn-iconfont>
        <span>check-mark</span>
      </li>
      <li>
        <Yn-iconfont name="checkbox-checked-disabled"></Yn-iconfont>
        <span>checkbox-checked-disabled</span>
      </li>
      <li>
        <Yn-iconfont name="checkbox-checked"></Yn-iconfont>
        <span>checkbox-checked</span>
      </li>
      <li>
        <Yn-iconfont name="checkbox-uncheck-disabled"></Yn-iconfont>
        <span>checkbox-uncheck-disabled</span>
      </li>
      <li>
        <Yn-iconfont name="checkbox-uncheck"></Yn-iconfont>
        <span>checkbox-uncheck</span>
      </li>
      <li>
        <Yn-iconfont name="clear"></Yn-iconfont>
        <span>clear</span>
      </li>
      <li>
        <Yn-iconfont name="close"></Yn-iconfont>
        <span>close</span>
      </li>
      <li>
        <Yn-iconfont name="collapsed-default"></Yn-iconfont>
        <span>collapsed-default</span>
      </li>
      <li>
        <Yn-iconfont name="collapsed-selected"></Yn-iconfont>
        <span>collapsed-selected</span>
      </li>
      <li>
        <Yn-iconfont name="doarrow"></Yn-iconfont>
        <span>doarrow</span>
      </li>
      <li>
        <Yn-iconfont name="expanded-default"></Yn-iconfont>
        <span>expanded-default</span>
      </li>
      <li>
        <Yn-iconfont name="expanded-selected"></Yn-iconfont>
        <span>expanded-selected</span>
      </li>
      <li>
        <Yn-iconfont name="minus-disabled"></Yn-iconfont>
        <span>minus-disabled</span>
      </li><li>
        <Yn-iconfont name="minus"></Yn-iconfont>
        <span>minus</span>
      </li>
      <li>
        <Yn-iconfont name="radio-off-disabled"></Yn-iconfont>
        <span>radio-off-disabled</span>
      </li><li>
        <Yn-iconfont name="radio-off"></Yn-iconfont>
        <span>radio-off</span>
      </li>
      <li>
        <Yn-iconfont name="radio-disabled"></Yn-iconfont>
        <span>radio-disabled</span>
      </li><li>
        <Yn-iconfont name="radio-on"></Yn-iconfont>
        <span>radio-on</span>
      </li>
      <li>
        <Yn-iconfont name="search"></Yn-iconfont>
        <span>search</span>
      </li>
      <li>
        <Yn-iconfont name="up-arrow"></Yn-iconfont>
        <span>up-arrow</span>
      </li>
      <li>
        <Yn-iconfont name="iconpay-success"></Yn-iconfont>
        <span>pay-success</span>
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
