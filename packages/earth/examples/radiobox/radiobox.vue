<template>
  <div>
    <h2>radiobox</h2>
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
  </div>
</template>

<script>
export default {
  name: "YnRadioboxPage",
  data() {
    return {
      disabledValue: false,
      value: true
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