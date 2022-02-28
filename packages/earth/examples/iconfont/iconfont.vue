<template>
  <div>
    <h2>iconfont</h2>
    <p>扩展icon</p>
    <yn-iconfont name="elm" size="40" @click="handleClick"></yn-iconfont>
    <yn-iconfont name="eldddm"></yn-iconfont>
    <p>内置icon</p>
    <ul>
      <li>
        <yn-iconfont name="add-disabled"></yn-iconfont>
        <span>add-disabled</span>
      </li>
      <li>
        <yn-iconfont name="add"></yn-iconfont>
        <span>add</span>
      </li>
      <li>
        <yn-iconfont name="check-mark"></yn-iconfont>
        <span>check-mark</span>
      </li>
      <li>
        <yn-iconfont name="checkbox-checked-disabled"></yn-iconfont>
        <span>checkbox-checked-disabled</span>
      </li>
      <li>
        <yn-iconfont name="checkbox-checked"></yn-iconfont>
        <span>checkbox-checked</span>
      </li>
      <li>
        <yn-iconfont name="checkbox-uncheck-disabled"></yn-iconfont>
        <span>checkbox-uncheck-disabled</span>
      </li>
      <li>
        <yn-iconfont name="checkbox-uncheck"></yn-iconfont>
        <span>checkbox-uncheck</span>
      </li>
      <li>
        <yn-iconfont name="clear"></yn-iconfont>
        <span>clear</span>
      </li>
      <li>
        <yn-iconfont name="close"></yn-iconfont>
        <span>close</span>
      </li>
      <li>
        <yn-iconfont name="minus-disabled"></yn-iconfont>
        <span>minus-disabled</span>
      </li><li>
        <yn-iconfont name="minus"></yn-iconfont>
        <span>minus</span>
      </li>
      <li>
        <yn-iconfont name="radio-off-disabled"></yn-iconfont>
        <span>radio-off-disabled</span>
      </li><li>
        <yn-iconfont name="radio-off"></yn-iconfont>
        <span>radio-off</span>
      </li>
      <li>
        <yn-iconfont name="radio-on-disabled"></yn-iconfont>
        <span>radio-on-disabled</span>
      </li><li>
        <yn-iconfont name="radio-on"></yn-iconfont>
        <span>radio-on</span>
      </li>
      <li>
        <yn-iconfont name="search"></yn-iconfont>
        <span>search</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "YnIconfontPage",
  data() {
    return {
      iconfontCollections: [],
      loaded: false
    };
  },
  methods: {
    handleClick(e) {
      console.log("111111", e);
    }
  }
};
</script>
<style type="text/css" scoped="scoped">
  .flex{
    background: #eee;
  }
  .icon-name{
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
