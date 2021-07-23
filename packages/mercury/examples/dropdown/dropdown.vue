<template>
  <div>
    <h2>yn-dropdown</h2>
    <yn-dropdown ref="dropdown" :borderRadius="0">
      <yn-button slot="target" @click="toggle">以下</yn-button>
      <div slot="content">里面是内容</div>
    </yn-dropdown>
    <yn-dropdown ref="dropup" direction="up">
      <yn-button slot="target" @click="toggle2">以上</yn-button>
      <div slot="content">里面是内容</div>
    </yn-dropdown>
    <yn-dropdown ref="left" direction="left">
      <yn-button slot="target" class="left" @click="toggle3">左边</yn-button>
      <div slot="content">里面是内容</div>
    </yn-dropdown>
    <yn-dropdown ref="right" direction="right">
      <yn-button slot="target" @click="toggle4">右边</yn-button>
      <div slot="content">里面是内容</div>
    </yn-dropdown>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "YnDropdownPage",
  data() {
    return {
    };
  },
  methods: {
    toggle() {
      this.$refs.dropdown.toggle();
    },
    toggle2() {
      this.$refs.dropup.toggle();
    },
    toggle3() {
      this.$refs.left.toggle();
    },
    toggle4() {
      this.$refs.right.toggle();
    }
  }
};
</script>
<style type="text/css" scoped>
.left {
  margin: 0 auto;
  display: block;
}
</style>
