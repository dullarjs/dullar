<template>
  <div class="textarea-container">
    <h2>yn-textarea</h2>
    <div class="box1">
      <yn-textarea @change="handleChange" @blur="handleChange" @focus="handleChange" v-model="text1" placeholder="请输入改签原因"></yn-textarea>
    </div>
    <pre>
      光标固定文字结尾
      是否获取焦点：{{focused}}
      是否换行：{{wrapped}}
      文字靠哪儿：{{ focused ? "获取焦点" : "失去焦点" + "并且"}} {{ wrapped ? "有换行" : "没有换行" }} 则{{ !focused && wrapped ? "靠左显示" : "靠右显示" }}
    </pre>

    <div class="box1">
      <yn-textarea :fixedCursor="false" @change="handleChange2" @blur="handleChange2" @focus="handleChange2" v-model="text2" placeholder="请输入改签原因"></yn-textarea>
    </div>
    <pre>
      光标不固定
      是否获取焦点：{{focused2}}
      是否换行：{{wrapped2}}
      文字靠哪儿：{{ focused2 ? "获取焦点" : "失去焦点" + "并且"}} {{ wrapped2 ? "有换行" : "没有换行" }} 则{{ !focused2 && wrapped2 ? "靠左显示" : "靠右显示" }}
    </pre>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "YnTextareaPage",
  data() {
    return {
      text1: "",
      text2: "",
      focused: false,
      focused2: false,
      wrapped: false,
      wrapped2: false,
    };
  },
  methods: {
    handleChange(e) {
      const value = e.e.target.value;
      console.log(value);
      // this.text1 = value.trim();
      // this.text1 = value.replace(/^\s+|\s+$/g,"").replace(/<\/?.+?>/g,"").replace(/[\r\n]/g, "");
      this.text1 = value;
      this.focused = e.focused;
      this.wrapped = e.wrapped;
    },
    handleChange2(e) {
      const value = e.e.target.value;
      console.log(value);
      // this.text1 = value.trim();
      // this.text1 = value.replace(/^\s+|\s+$/g,"").replace(/<\/?.+?>/g,"").replace(/[\r\n]/g, "");
      this.text2 = value;
      this.focused2 = e.focused;
      this.wrapped2 = e.wrapped;
    }
  }
};
</script>

<style type="text/css" scoped="scoped">
  .box1 {
    width: 95%;
    margin: 30px auto;
  }
</style>
