<template>
  <div class="shipping-badge-box">
    <h2>yn-badge</h2>
    <yn-badge class="mr20" :count="20" :dot="true"> text </yn-badge>
    <yn-badge class="mr20" :count="5"> 99 </yn-badge>
    <yn-badge class="mr20" :count="50"> 中文 </yn-badge>
    <yn-badge class="mr20" :count="0" showZero> 中文 </yn-badge>
    <yn-badge class="mr20" :count="522"> 请 </yn-badge>
    <yn-badge class="mr20" :count="0"> 中文 </yn-badge>
  </div>
</template>
<script>
export default {
  name: "YnBadgePage",
  data() {
    return {};
  },
  methods: {},
};
</script>
<style type="text/css">
.mr20 {
  margin-right: 20px;
}
</style>
