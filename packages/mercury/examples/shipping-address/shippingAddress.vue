<template>
  <div class="shipping-address-box">
    <h2>yn-shipping-address</h2>
    <div class="address-box">
      <yn-shipping-address :address="getAddressObject()" :staticAddress="staticAddress" @done="handleDone"></yn-shipping-address>
    </div>
  </div>
</template>
<script>
const sources = require("./area.json").RECORDS;
const staticAddress = [
  {
    "region_id": "1001",
    "parent_id": "10",
    "region_name": "上海",
    "region_type": "1",
    "agency_id": "0",
    "region_name_en": ""
  },
  {
    "region_id": "100116",
    "parent_id": "1001",
    "region_name": "奉贤区",
    "region_type": "2",
    "agency_id": "0",
    "region_name_en": ""
  },
  {
    "region_id": "10011602",
    "parent_id": "100116",
    "region_name": "南桥镇",
    "region_type": "3",
    "agency_id": "0",
    "region_name_en": ""
  }
];
export default {
  name: "YnShippingAddressPage",
  data() {
    return {
      sources,
      staticAddress
    }
  },
  methods: {
    handleDone(address) {
      console.log("获取到的地址", address);
    },
    getAddress(args) {
      console.log("args = ", args);
      const result = [];
      sources.forEach((region) => {
        if (!args.region_id) {
          if (region.region_type === args.region_type) {
            result.push(region);
          }
        } else {
          if (region.parent_id === args.region_id) {
            result.push(region);
          }
        }
      });
      // this.Indicator.open({ spinType: "rotate", background: "#fff", lockScreen: true, transparent: true });
      return new Promise((resolve, reject) => {
        console.log(reject);
        setTimeout(() => {
          // this.Indicator.close();
          resolve(result);
        }, 1000);
      }).catch(err => {
        // this.Indicator.close();
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
.address-box {
  margin-left: 20px;
}
</style>
