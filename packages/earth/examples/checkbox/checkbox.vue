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
    </ul>
    <h2>下面是动态循环的案例</h2>
    <ul>
      <li class="outer-box" @click="handleItemClick(item)" v-for="(item, key) in list" :key="key">
        <yn-checkbox disableClick v-model="item.status"></yn-checkbox>
        <span>支持整行点击</span>
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
      value: true,
      list: [
        { status: false },
        { status: false },
        { status: false },
        { status: false },
        { status: true },
        { status: false },
        { status: false },
        { status: false },
        { status: false },
      ]
    };
  },
  methods: {
    handleClick(e) {
      console.log("改变状态了", e);
    },
    handleItemClick(item) {
      console.log("item", item);
      item.status = !item.status;
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
  .outer-box {
    background: #eee;
  }
</style>
