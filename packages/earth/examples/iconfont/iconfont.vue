<template>
  <div>
    <h2>iconfont</h2>
    <yn-iconfont name="elm" size="40" @click="handleClick"></yn-iconfont>
    <yn-iconfont name="eldddm"></yn-iconfont>
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
</style>
