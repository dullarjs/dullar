<template>
  <div id="example">
    <yn-layout :showFooter="false">
      <router-view slot="body"></router-view>
    </yn-layout>
  </div>
</template>
<script type="text/javascript">
import "./less/style.less";
export default {
  name: "examples"
};
</script>
<style type="text/css">
body,
html,
#example,
#example > div {
  height: 100%;
  padding: 0;
  margin: 0;
}
</style>
