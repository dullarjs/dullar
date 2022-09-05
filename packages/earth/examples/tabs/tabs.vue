<template>
  <div>
    <h2>yn-tabs</h2>
    <div class="box">
      <yn-tabs :border="false" v-model="active" @change="change">
        <yn-tab-item :key="index" :title="'Tab' + index" v-for="index in 4">
          <div class="tab-content">
            content of tab {{ index }}
          </div>
        </yn-tab-item>
      </yn-tabs>
    </div>
    <div class="box">
      <yn-tabs v-model="active2" @click="handleClick">
        <yn-tab-item
          :key="index"
          :title="'Tab' + index"
          v-for="index in 8"
          :disabled="index === 4"
        >
          <div class="tab-content">
            content of tab {{ index }}
          </div>
        </yn-tab-item>
      </yn-tabs>
    </div>
    <div class="box">
      <yn-tabs v-model="active2">
        <yn-tab-item :key="index" :title="'Tab' + index" v-for="index in 2">
          <div class="tab-content">
            content of tab {{ index }}
          </div>
        </yn-tab-item>
      </yn-tabs>
    </div>
    <div class="box">
      <yn-tabs v-model="active3">
        <yn-tab-item key="1" title="全部售后单">全部售后单</yn-tab-item>
        <yn-tab-item key="2" title="待审批">待审批</yn-tab-item>
        <yn-tab-item key="3" title="待处理">待处理</yn-tab-item>
        <yn-tab-item key="4" title="已完成">已完成</yn-tab-item>
        <yn-tab-item key="5" title="已关闭">已关闭</yn-tab-item>
      </yn-tabs>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "YnTabsPage",
  data() {
    return {
      active: 1,
      active2: 1,
      active3: 1
    };
  },
  methods: {
    change(e) {
      this.Toast(`${e.value} changed`);
    },
    handleClick(e) {
      if (e.disabled) {
        this.Toast(`${e.value} is disabled`);
      } else {
        this.Toast(`${e.value} clicked`);
      }
    }
  }
};
</script>

<style type="text/css" scoped="scoped">
.box {
  margin: 30px auto;
}
.tab-content {
  height: 150px;
}
</style>
