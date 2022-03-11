<template>
  <div class="example-container">
    <div class="example-container__left">
      <yn-scrollbar
        class="page__nav"
        wrapClass="yn-dropdown__wrap"
        viewClass="yn-dropdown-view"
      >
        <ul class="page-title">
          <li class="nav-item">组件</li>
          <li class="page-title__item" @click="jump('dropdown')">dropdown</li>
          <li class="page-title__item" @click="jump('scrollbar')">scrollbar</li>
          <li class="page-title__item" @click="jump('select')">select</li>
          <li class="page-title__item" @click="jump('field')">field</li>
          <li class="page-title__item" @click="jump('checkbox')">checkbox</li>
          <li class="page-title__item" @click="jump('radiobox')">radiobox</li>
          <li class="page-title__item" @click="jump('iconfont')">iconfont</li>
          <li class="page-title__item" @click="jump('indicator')">indicator</li>
          <li class="page-title__item" @click="jump('spin')">spin</li>
          <li class="page-title__item" @click="jump('dialog')">dialog</li>
          <li class="page-title__item" @click="jump('popover')">Popover</li>
          <li class="page-title__item" @click="jump('cityPicker')">cityPicker</li>
          <li class="page-title__item" @click="jump('calendar')">calendar</li>
          <li class="page-title__item" @click="jump('datePicker')">datePicker</li>
          <li class="page-title__item" @click="jump('notification')">notification</li>
        </ul>
      </yn-scrollbar>
    </div>
    <div class="example-container__right">
      <yn-scrollbar
        class="page-container"
        wrapClass="yn-dropdown__wrap"
        viewClass="yn-dropdown-view"
      >
        <router-view></router-view>
      </yn-scrollbar>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "Content",
  methods: {
    jump(name = "") {
      this.$router.push({ name });
    }
  }
};
</script>
<style lang="scss">
.example-container {
  display: flex;
  .example-container__left{
    .page__nav > .yn-dropdown__wrap{
      height: 100vh;
    }
  }
  .example-container__right{
    flex:1;
    .page-container > .yn-dropdown__wrap{
      height:100vh;
      & > .yn-dropdown-view{
        padding: 20px;
      }
    }
  }
}
.page-title{
  height:100%;
  width: 240px;
  padding: 10px 20px;
  .page-title__item{
    list-style-type: none;
    height: 40px;
    color: #444;
    line-height: 40px;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: normal;
    &:hover{
      color: #409EFF;
      cursor: pointer;
    }
  }
  .nav-item{
    font-size: 16px;
    color: #333;
    line-height: 40px;
    height: 40px;
    margin: 0;
    padding: 0;
    text-decoration: none;
    display: block;
    position: relative;
    transition: 0.15s ease-out;
    font-weight: bold;
  }
}
</style>
