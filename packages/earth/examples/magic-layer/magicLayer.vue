<template>
  <div class="container">
    <!-- <h2>yn-magic-layer</h2> -->
    <yn-magic-layer>
      <div class="inner" slot="inner">1</div>
      <div slot="outside">2</div>
    </yn-magic-layer>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: "YnMagicLayerPage",
    mounted() {
    }
  };
</script>
<style type="text/css" scoped="scoped">
  .container {
    height: 100%;
  }
  .inner {
    height: 200px;
  }
</style>
