<template>
  <div>加载中...</div>
</template>
<script type="text/javascript">
  export default {
    name: "loading",
    created() {
      console.log("created");
    },
    mounted() {
      console.log("loading ----");
    },
    beforeDestroy() {
      console.log("beforeDestroy -----------");
    },
    destroyed() {
      console.log("destroyed 0000");
    }
  };
</script>