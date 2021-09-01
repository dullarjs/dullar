<template>
  <div class="shipping-address-box">
    <h2>yn-address</h2>
    <!-- <yn-field-group>
      <yn-field v-model="address" placeholder="请选择地址" @click="onoff"></yn-field>
    </yn-field-group> -->
    <yn-button @click="onoff">请选择地址</yn-button>
    <p>{{ detailAddress.join(",") }}</p>
    <yn-address v-model="showAddress" @done="handleDone" :address="getAddressObject()"></yn-address>
  </div>
</template>
<script>
const sources = require("./area.json").RECORDS;
export default {
  name: "YnAddressPage",
  data() {
    return {
      sources,
      address: "",
      showAddress: false,
      detailAddress: []
    }
  },
  methods: {
    handleDone(args) {
      this.detailAddress = [];
      args.forEach(address => {
        this.detailAddress.push(address.region_name);
      });
    },
    onoff() {
      this.showAddress = !this.showAddress;
    },
    getAddress(args) {
      console.log("args = ", args);
      const { regionType, regionId } = args;
      const result = [];
      sources.forEach((region) => {
        if (!regionId) {
          if (region.region_type === regionType) {
            result.push(region);
          }
        } else {
          if (region.parent_id === regionId) {
            result.push(region);
          }
        }
      });
      this.Indicator.open({ spinType: "rotate", background: "#fff", lockScreen: true, transparent: true });
      return new Promise((resolve, reject) => {
        console.log(reject);
        setTimeout(() => {
          this.Indicator.close();
          console.log("result是", result);
          resolve(result);
        }, 1000);
      }).catch(err => {
        this.Indicator.close();
        console.log(err);
      });
    },
    getAddressObject() {
      return {
        params: { a: 1, b: 2, c: 3 },
        action: this.getAddress,
        parse: (e) => {
          return e.region_name ? e.region_name : e;
        }
      }
    },
  }
};
</script>
<style type="text/css">
</style>
