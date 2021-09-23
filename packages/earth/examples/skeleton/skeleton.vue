<template>
  <div class="yn-skeleton-container">
    <h2>yn-skeleton</h2>
    <div class="">
      <yn-skeleton rows="10" :avatar="false"></yn-skeleton>
      <yn-skeleton rows="5" :whiteSpace="whiteSpace"></yn-skeleton>
      <!-- <yn-skeleton :avatar="false"></yn-skeleton> -->
      <yn-skeleton></yn-skeleton>
      <!-- <yn-skeleton></yn-skeleton>
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
      whiteSpace: [
        {
          row: 1,
          align: "right",
          width: 0.6,
        },
        {
          row: 2,
          align: "right",
          width: 0.3,
        },
        {
          row: 3,
          align: "right",
          width: 0.3,
        },
        {
          row: 4,
          align: "right",
          width: 0.1,
        },
        {
          row: 5,
          align: "left",
          width: 1,
        },
        {
          row: 6,
          align: "left",
          width: 0.7,
        },
      ],
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
