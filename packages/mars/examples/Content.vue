<template>
  <div class="example-container">
    <div class="example-container__left">
      <ul class="page-title">
        <li class="page-title__item" @click="jump('dialog')">dialog</li>
        <li class="page-title__item" @click="jump('popover')">Popover</li>
        <li class="page-title__item" @click="jump('toast')">toast</li>
        <li class="page-title__item" @click="jump('calendar')">calendar</li>
        <li class="page-title__item" @click="jump('cityPicker')">cityPicker</li>
        <li class="page-title__item" @click="jump('datePicker')">datePicker</li>
      </ul>
    </div>
    <div class="example-container__right">
      <router-view></router-view>
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
<style lang="scss" scoped>
.example-container {
  display: flex;
  .example-container__left{
    padding:20px;
  }
  .example-container__right{
    flex:1;
    padding:20px;
  }
}
.page-title{
  margin-top: 40px;
  .page-title__item{
    list-style-type: none;
    padding:5px;
  }
}
</style>
