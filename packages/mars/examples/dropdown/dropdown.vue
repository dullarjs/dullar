<template>
  <div class="dropdown-page">
    <h3>基本用法</h3>
    <yn-dropdown v-model="value1" @input="handleInput">
      <span class="yn-dropdown-link">
        下拉菜单<i class="yn-icon-arrow-down yn-icon--right"></i>
      </span>
      <yn-dropdown-menu slot="dropdown">
        <yn-dropdown-item v-for="(item, index) in options" :key="index"
          :value="item.value"
          :label="item.label"
        >
        </yn-dropdown-item>
      </yn-dropdown-menu>
    </yn-dropdown>
    <h3>checkbox多选</h3>
    <yn-dropdown v-model="value2" @input="handleInput2" multiple>
      <span class="yn-dropdown-link">
        航空公司<i class="yn-icon-arrow-down yn-icon--right"></i>
      </span>
      <yn-dropdown-menu slot="dropdown">
        <yn-dropdown-item v-for="(item, index) in flightComps" :key="index"
          :value="item.value"
          :label="item.label"
          :checked="item.checked"
          :type="'checkbox'"
        >
        </yn-dropdown-item>
      </yn-dropdown-menu>
    </yn-dropdown>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import "./style/index.scss";
import { Component } from "vue-property-decorator";
@Component({
  name: "dropdownPage"
})
export default class DropdownPage extends Vue {
  value1 = "";
  value2Last: string[] = [];
  value2 = ["eastFlight"];
  options = [{
    value: '选项1',
    label: '黄金糕'
  }, {
    value: '选项2',
    label: '双皮奶'
  }, {
    value: '选项3',
    label: '蚵仔煎'
  }, {
    value: '选项4',
    label: '龙须面'
  }, {
    value: '选项5',
    label: '北京烤鸭'
  }, {
    value: '选项6',
    label: '湖北省武汉市李记热干面'
  }, {
    value: '选项7',
    label: '豆皮'
  }, {
    value: '选项8',
    label: '天津大麻花'
  }, {
    value: '选项9',
    label: '襄阳牛肉面'
  }];
  flightComps = [
    {
      label: "不限",
      value: "unlimit"
    },
    {
      label: "东方航空",
      value: "eastFlight"
    },
    {
      label: "南方航空",
      value: "southFlight"
    },
    {
      label: "吉祥航空",
      value: "jixiangFlight"
    }
  ];
  handleInput(e: string | number | (string | number)[]) {
    console.log("dropItem.value:", e);
  }
  handleInput2(e: (string | number)[]) {
    console.log("dropItem.value:", e);
    // 若此次 勾选了不限，则 只保留不限。 若此次没有勾选不限，则 取消不限
    if (this.value2Last.indexOf("unlimit") > -1)  {
      // 上一次有不限
      let index = e.indexOf("unlimit");
      if (e.length > 1 && index > -1) {
        this.value2.splice(index, 1);
      }
    } else {
      // 上一次没有不限
      let index = e.indexOf("unlimit");
      if (e.length > 1 && index > -1) {
        this.value2 = ["unlimit"];
      }
    }
    this.value2Last = [...this.value2];
  }
}
</script>