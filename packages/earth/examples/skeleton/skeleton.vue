<template>
  <div class="yn-skeleton-container">
    <h2>yn-skeleton</h2>
    <div class="">
      <yn-skeleton rows="10" :avatar="false"></yn-skeleton>
      <yn-skeleton rows="5" :whiteSpace="whiteSpace"></yn-skeleton>
      <!-- <yn-skeleton :avatar="false"></yn-skeleton> -->
      <!--     <yn-skeleton></yn-skeleton>
      <yn-skeleton></yn-skeleton>
      <yn-skeleton></yn-skeleton>
      <yn-skeleton></yn-skeleton>
      <yn-skeleton></yn-skeleton>
      <yn-skeleton></yn-skeleton>
      <yn-skeleton></yn-skeleton> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "YnFieldPage",
  data() {
    return {
      whiteSpace: {
        1: {
          direction: "right",
          width: 0.6,
        },
        2: {
          direction: "right",
          width: 0.3,
        },
        3: {
          direction: "right",
          width: 0.3,
        },
        4: {
          direction: "right",
          width: 0.1,
        },
        5: {
          direction: "left",
          width: 1,
        },
        6: {
          direction: "left",
          width: 0.7,
        },
      },
    };
  },
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
