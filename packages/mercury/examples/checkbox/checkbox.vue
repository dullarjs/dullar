<template>
  <div>
    <h2>yn-checkbox</h2>
    <ul>
      <li>
        <yn-checkbox v-model="checked" @change="handleClick"></yn-checkbox>
        <span>当前状态{{ checked }}</span>
      </li>
      <li>
        <yn-checkbox v-model="checked" disabled @change="handleClick"></yn-checkbox>
        <span>此状态不可修改{{ checked }}</span>
      </li>
      <li>
        <yn-checkbox v-model="value"></yn-checkbox>
        <span>当前状态{{ value }}</span>
      </li>
      <li>
        <yn-checkbox v-model="value" disabled></yn-checkbox>
        <span>此状态不可修改{{ value }}</span>
      </li>
      <li>
        <yn-checkbox indeterminate></yn-checkbox>
        <span>retraction</span>
      </li>
    </ul>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "YnCheckboxPage",
  data() {
    return {
      checked: false,
      value: true
    };
  },
  methods: {
    handleClick(e) {
      console.log("改变状态了", e);
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
