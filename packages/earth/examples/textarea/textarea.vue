<template>
  <div class="textarea-container">
    <h2>yn-textarea</h2>
    <div class="box1">
      <yn-textarea @change="handleChange" @blur="handleChange" @focus="handleChange" v-model="text1" placeholder="请输入改签原因"></yn-textarea>
    </div>
    <pre>
      是否获取焦点：{{focused}}
      是否换行：{{wrapped}}
      文字靠哪儿：{{ focused ? "获取焦点" : "失去焦点" + "并且"}} {{ wrapped ? "有换行" : "没有换行" }} 则{{ !focused && wrapped ? "靠左显示" : "靠右显示" }}
    </pre>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "YnTextareaPage",
  data() {
    return {
      text1: "",
      focused: false,
      wrapped: false
    };
  },
  methods: {
    handleChange(e) {
      this.focused = e.focused;
      this.wrapped = e.wrapped;
    }
  }
};
</script>

<style type="text/css" scoped="scoped">
  .box1 {
    width: 95%;
    margin: 0 auto;
  }
</style>
