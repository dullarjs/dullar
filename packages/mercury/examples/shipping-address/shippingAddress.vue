<template>
  <div class="shipping-address-box">
    <h2>yn-shipping-address</h2>
    <yn-shipping-address :sources="sources.RECORDS"></yn-shipping-address>
  </div>
</template>
<script>
const sources = require("./area.json");
console.log(sources);
export default {
  name: "YnShippingAddressPage",
  data() {
    return {
      sources
    }
  },
  methods: {
  }
};
</script>
<style type="text/css">
</style>
