<template>
  <div class="shipping-address-box">
    <h2>yn-address</h2>
    <!-- <yn-field-group>
      <yn-field v-model="address" placeholder="请选择地址" @click="onoff"></yn-field>
    </yn-field-group> -->
    <yn-button @click="onoff">请选择地址</yn-button>
    <yn-button @click="fromRight">从右边进入</yn-button>
    <p>{{ detailAddress.join(",") }}</p>
    <yn-address :attributeMapping="attributeMapping" :defaultParams="defaultParams" v-model="showAddress" @done="handleDone" :address="getAddressObject()"></yn-address>
    <yn-address class="right-address" position="right" :showBackIcon="true" :showCloseIcon="false" :attributeMapping="attributeMapping" :defaultParams="defaultParams" v-model="rightAddress" @done="handleDone" :address="getAddressObject()"></yn-address>
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
      rightAddress: false,
      detailAddress: [],
      defaultParams: { region_type: "1", region_id: "10" },
      attributeMapping: {
        id: "region_id",
        parentId: "parent_id",
        type: "region_type"
      }
    }
  },
  methods: {
    handleDone(args) {
      this.detailAddress = [];
      args.forEach(address => {
        this.detailAddress.push(address.region_name);
      });
    },
    fromRight() {
      this.rightAddress = !this.rightAddress;
    },
    onoff() {
      this.showAddress = !this.showAddress;
    },
    getAddress(args) {
      console.log("args = ", args);
      // const { type, id } = args;
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
  .right-address .address-popup{
      width: 90%;
  }
</style>
