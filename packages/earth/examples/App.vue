<template>
  <div id="example">
    <!-- <keep-alive>
    </keep-alive> -->
    <yn-layout :showFooter="false">
      <div slot="body">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
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
