<template>
  <div>
    <h2>radiobox</h2>
    <h3>dot 类型</h3>
    <ul>
      <li>
        <yn-radiobox v-model="value"></yn-radiobox>
        <span>激活可选状态{{ value }}</span>
      </li>
      <li>
        <yn-radiobox v-model="value" disabled></yn-radiobox>
        <span>激活不可选状态{{ value }}</span>
      </li>
      <li>
        <yn-radiobox v-model="disabledValue"></yn-radiobox>
        <span>非激活可选状态</span>
      </li>
      <li>
        <yn-radiobox v-model="disabledValue" disabled></yn-radiobox>
        <span>非激活不可选状态</span>
      </li>
    </ul>
    <h3>check 类型</h3>
    <ul>
      <li>
        <yn-radiobox v-model="value1" type="check"></yn-radiobox>
        <span>激活可选状态{{ value }}</span>
      </li>
      <li>
        <yn-radiobox v-model="value1" disabled type="check"></yn-radiobox>
        <span>激活不可选状态{{ value }}</span>
      </li>
      <li>
        <yn-radiobox v-model="disabledValue1" type="check"></yn-radiobox>
        <span>非激活可选状态</span>
      </li>
      <li>
        <yn-radiobox v-model="disabledValue1" disabled type="check"></yn-radiobox>
        <span>非激活不可选状态</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "YnRadioboxPage",
  data() {
    return {
      disabledValue: false,
      value: true,
      disabledValue1: false,
      value1: true
    };
  },
  methods: {
    handleChange(e) {
      console.log("改变了", e);
    }
  }
};
</script>
<style type="text/css" scoped="scoped">
  ul {
    list-style: none;
  }
  ul li {
    margin: 5px 0;
  }
</style>