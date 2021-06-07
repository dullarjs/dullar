<template>
  <div class="button-view">
    <div id="container">
      <ul>
        <li><q-button>default text</q-button></li>
        <li><q-button type="primary">primary text</q-button></li>
        <li><q-button disabled>disabled text</q-button></li>
        <li><q-button type="dashed">dashed</q-button></li>
        <li><q-button danger>danger default</q-button></li>
        <li><q-button danger type="primary">danger primary</q-button></li>
        <li><q-button danger type="dashed">danger dashed</q-button></li>
        <li><q-button loading type="primary">Loading</q-button></li>
        <li><q-button @click="handleClick" :loading="loadingStatus" type="primary">Loading</q-button></li>
        <li><q-button loading danger type="default">danger primary</q-button></li>
        <li><q-button textHideWhenLoading loading type="default">default</q-button></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
export default class Button extends Vue {
  public loadingStatus = false;
  handleClick() {
    if (this.loadingStatus) {
      return;
    }
    this.loadingStatus = true;
    const timer = setTimeout(() => {
      this.loadingStatus = false;
      clearTimeout(timer);
    }, 5000);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style: none;
}
ul li{
  margin: 10px auto;
}
</style>
