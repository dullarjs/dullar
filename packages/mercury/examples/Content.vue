<template>
  <div class="example-container">
    <ul>
      <li @click="jump('toast')">toast</li>
      <li @click="jump('indicator')">indicator</li>
      <li @click="jump('spin')">spin</li>
      <li @click="jump('iconfont')">iconfont</li>
      <li @click="jump('checkbox')">checkbox</li>
      <li @click="jump('radiobox')">radiobox</li>
      <li @click="jump('popup')">popup</li>
      <li @click="jump('button')">button</li>
      <li @click="jump('flex')">flex</li>
      <li @click="jump('actionSheet')">actionSheet</li>
      <li @click="jump('field')">field</li>
      <li @click="jump('layout')">layout</li>
      <li @click="jump('sticky')">sticky</li>
      <li @click="jump('dialog')">dialog</li>
      <li @click="jump('modal')">modal</li>
      <li @click="jump('picker')">picker</li>
      <li @click="jump('swipe')">swipe</li>
      <li @click="jump('tabs')">tabs</li>
      <li @click="jump('pullRefresh')">pullRefresh</li>
      <li @click="jump('datePicker')">datePicker</li>
      <li @click="jump('counter')">counter</li>
      <li @click="jump('skeleton')">skeleton</li>
      <li @click="jump('animationList')">animationList</li>
      <li @click="jump('category')">category</li>
      <li @click="jump('magnifier')">magnifier</li>
      <li @click="jump('cascader')">cascader</li>
      <li @click="jump('pagination')">pagination</li>
      <li @click="jump('table')">table</li>
      <li @click="jump('shippingAddress')">shippingAddress</li>
      <li @click="jump('elasticSearch')">elasticSearch</li>
      <li @click="jump('categoryMobile')">categoryMobile</li>
      <li @click="jump('address')">address</li>
      <li @click="jump('badge')">badge</li>
      <li @click="jump('tooltip')">tooltip</li>
      <li @click="jump('input')">input</li>
      <li @click="jump('tree')">tree</li>
      <li @click="jump('calendar')">calendar</li>
      <li @click="jump('slide')">slide</li>
      <li @click="jump('image')">image</li>
      <li @click="jump('form')">form</li>
    </ul>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "Content",
  methods: {
    jump(name = "") {
      this.$router.push({ name });
    },
  },
};
</script>
