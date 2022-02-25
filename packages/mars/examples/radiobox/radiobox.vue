<template>
  <div>
    <h2>radiobox</h2>
    <ul>
      <li>
        <Yn-radiobox v-model="value"></Yn-radiobox>
        <span>激活可选状态{{ value }}</span>
      </li>
      <li>
        <Yn-radiobox v-model="value" disabled></Yn-radiobox>
        <span>激活不可选状态{{ value }}</span>
      </li>
      <li>
        <Yn-radiobox v-model="disabledValue"></Yn-radiobox>
        <span>非激活可选状态</span>
      </li>
      <li>
        <Yn-radiobox v-model="disabledValue" disabled></Yn-radiobox>
        <span>非激活不可选状态</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "vue";
@Component({
  name: "RadioboxPage"
})
export default class RadioboxPage extends Vue  {
  disabledValue = false;
  value = true;
  handleChange(e: Event) {
    console.log("改变了", e);
  }
}
</script>
<style type="text/css" scoped="scoped">
  ul {
    list-style: none;
  }
  ul li {
    margin: 5px 0;
  }
</style>