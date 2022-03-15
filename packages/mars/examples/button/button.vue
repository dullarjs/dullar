<template>
  <div class="button-box">
    <h2>基础用法</h2>
    <div class="button-group">
      <span class="button-group__title">默认风格</span>
      <yn-button >默认</yn-button>
      <yn-button type="danger">危险</yn-button>
      <yn-button type="primary">主题色</yn-button>
      <yn-button type="warning">警告</yn-button>
      <yn-button type="text">text</yn-button>
    </div>
    <div class="button-group">
      <span class="button-group__title">朴素风格</span>
      <yn-button plain>朴素</yn-button>
      <yn-button plain type="danger">危险</yn-button>
      <yn-button plain type="primary">主题色</yn-button>
      <yn-button plain type="warning">警告</yn-button>
      <yn-button plain type="text">text</yn-button>
    </div>
    <h2>禁用状态</h2>
    <div class="button-group">
      <span class="button-group__title">默认风格</span>
      <yn-button disabled>默认</yn-button>
      <yn-button disabled type="danger">危险</yn-button>
      <yn-button disabled type="primary">主题色</yn-button>
      <yn-button disabled type="warning">警告</yn-button>
      <yn-button disabled type="text">text</yn-button>
    </div>
    <div class="button-group">
      <span class="button-group__title">朴素风格</span>
      <yn-button disabled plain>朴素</yn-button>
      <yn-button disabled plain type="danger">危险</yn-button>
      <yn-button disabled plain type="primary">主题色</yn-button>
      <yn-button disabled plain type="warning">警告</yn-button>
      <yn-button disabled plain type="text">text</yn-button>
    </div>
    <h2>不同尺寸按钮</h2>
    <yn-button>默认按钮</yn-button>
    <yn-button size="medium">中等按钮</yn-button>
    <yn-button size="small">小型按钮</yn-button>
    <yn-button size="mini">超小按钮</yn-button>
    <h2>yn-button</h2>
    <yn-button @click="handleClick"><span>这是文案，可点击</span></yn-button>
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
    
    <hr />
    <yn-button type="text" :loading="true">text loading</yn-button>
    <hr />
    <yn-button type="warning" plain>plain</yn-button>
    <hr />
    <yn-button :loading="true" loadingText="loading text">plain</yn-button>
    <hr />
    <yn-button iconName="elm" iconColor="red">button with icon</yn-button>
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
<style lang="scss">
.yn-button+.yn-button{
  margin-left: 10px;
}
.button-group{
  &+.button-group{
    margin-top: 10px;
  }
  .button-group__title{
    margin-right: 10px;
  }
}
hr {
  border: none;
}
</style>
