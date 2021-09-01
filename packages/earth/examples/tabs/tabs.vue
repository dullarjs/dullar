<template>
  <div>
    <h2>yn-tabs</h2>
    <div class="box">
      <yn-tabs v-model="active" @change="change">
        <yn-tab-item :key="index" :title="'Tab' + index" v-for="index in 4">
          content of tab {{ index }}
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
          content of tab {{ index }}
        </yn-tab-item>
      </yn-tabs>
    </div>
    <div class="box">
      <yn-tabs v-model="active2">
        <yn-tab-item :key="index" :title="'Tab' + index" v-for="index in 2">
          content of tab {{ index }}
        </yn-tab-item>
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
      active2: 1
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
</style>
