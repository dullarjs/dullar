<template>
  <div id="d-container">
    <h2>yn-dragable</h2>
    <yn-dragable @click="handleClick">
      <div class="ball"></div>
    </yn-dragable>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: "YnDragablePage",
    data() {
      return {
      };
    },
    methods: {
      handleClick() {
        this.Toast("点击了");
      }
    }
  };
</script>

<style type="text/css" scoped="scoped">
  .ball {
    background: gray;
    width:  50px;
    height:  50px;
    border-radius: 50%;
    background: linear-gradient(#36455b, #283446);
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 20%), 0 0 8px rgb(0 0 0 / 30%), 0 12px 12px rgb(0 0 0 / 40%);
  }
</style>
