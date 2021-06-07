<template>
  <div class="dropdown-view">
    <h2>q-dropdown</h2>
    <q-dropdown ref="dropdown" :borderRadius="0">
      <template #target>
        <q-button @click="toggle">以下</q-button>
      </template>
      <template #content>
        <div>里面是内容</div>
      </template>
    </q-dropdown>
    <q-dropdown ref="dropup" direction="up">
      <template #target>
        <q-button @click="toggle2">以上</q-button>
      </template>
      <template #content>
        <div>里面是内容</div>
      </template>
    </q-dropdown>
    <q-dropdown ref="left" direction="left">
      <template #target>
        <q-button class="left" @click="toggle3">左边</q-button>
      </template>
      <template #content>
        <div>里面是内容</div>
      </template>
    </q-dropdown>
    <q-dropdown ref="right" direction="right">
      <template #target>
        <q-button @click="toggle4">右边</q-button>
      </template>
      <template #content>
        <div>里面是内容</div>
      </template>
    </q-dropdown>
  </div>
</template>
<script lang="ts">
  import { Vue } from "vue-class-component";
  export default class Dropdown extends Vue {
    toggle() {
      this.$refs.dropdown.toggle();
    }
    toggle2() {
      this.$refs.dropup.toggle();
    }
    toggle3() {
      this.$refs.left.toggle();
    }
    toggle4() {
      this.$refs.right.toggle();
    }
  }
</script>
<style type="text/css" scoped="scoped">
  .left {
    margin: 0 auto;
    display: block;
  }
</style>
