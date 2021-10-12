<template>
  <div class="yn-skeleton-container">
    <h2>yn-skeleton</h2>
    <div class="">
      <yn-skeleton :rows="0" :avatar="false" type="card"></yn-skeleton>
      <yn-skeleton rows="10" :avatar="false"></yn-skeleton>
      <yn-skeleton rows="10"></yn-skeleton>
    </div>
  </div>
</template>
<script>
export default {
  name: "YnFieldPage",
  data() {
    return {
    };
  }
};
</script>
<style type="text/css" scoped="scoped">
.box {
  height: 100%;
}
.box ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.box ul li {
  margin: 10px 0;
}
</style>
