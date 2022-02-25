<template>
  <div class="button-box">
    <h2>yn-button</h2>
    <yn-button @click="handleClick"><span>这是文案，可点击</span></yn-button>
    <hr />
    <yn-button disabled><span>禁止点击</span></yn-button>
    <hr />
    <!-- 异步加载的时候text设置为空 -->
    <yn-button :loading="true" loadingText="" loadingColor="red"
      ><span>这是文案</span></yn-button
    >
    <hr />
    <yn-button :loading="true" size="large" loadingColor="green"
      ><span>这是文案</span></yn-button
    >
    <hr />
    <yn-button :loading="true" size="small"
      ><span>我不可以点击</span></yn-button
    >
    <hr />
    <yn-button type="danger">危险</yn-button>
    <hr />
    <yn-button type="primary">主题色</yn-button>
    <hr />
    <yn-button type="warning">警告</yn-button>
    <hr />
    <yn-button type="primary" plain>plain</yn-button>
    <hr />
    <yn-button type="texted">text</yn-button>
    <hr />
    <yn-button type="texted" :loading="true">text loading</yn-button>
    <hr />
    <yn-button type="warning" plain>plain</yn-button>
    <hr />
    <yn-button :loading="true" loadingText="loading text">plain</yn-button>
    <hr />
    <yn-button iconName="iconback" iconColor="red">button with icon</yn-button>
  </div>
</template>
<script>
export default {
  name: "YnButtonPage",
  methods: {
    handleClick() {
      console.log("接收到click事件");
      alert("我被点击了~~");
    }
  }
};
</script>
<style type="text/css">
.button-box {
  text-align: center;
}
hr {
  border: none;
}
</style>
