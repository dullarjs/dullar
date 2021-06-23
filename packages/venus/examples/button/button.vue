<template>
  <div class="button-view">
    <div id="container">
      <h2>middle</h2>
      <ul>
        <li><v-button>default text</v-button></li>
        <li><v-button type="primary">primary text</v-button></li>
        <li><v-button type="primary" disabled>primary disabled text</v-button></li>
        <li><v-button disabled>default disabled text</v-button></li>
      </ul>
      <h2>small</h2>
      <ul>
        <li><v-button size="small">default text</v-button></li>
        <li><v-button size="small" type="primary">primary text</v-button></li>
        <li><v-button size="small" type="primary" disabled>primary disabled text</v-button></li>
        <li><v-button size="small" disabled>default disabled text</v-button></li>
      </ul>
      <h2>large</h2>
      <ul>
        <li><v-button size="large">default text</v-button></li>
        <li><v-button size="large" type="primary">primary text</v-button></li>
        <li><v-button size="large" type="primary" disabled>primary disabled text</v-button></li>
        <li><v-button size="large" disabled>default disabled text</v-button></li>
      </ul>
      <h2>loading</h2>
      <ul>
        <li><v-button :loading="true" type="primary">Loading primary</v-button></li>
        <li><v-button @click="handleClick" :loading="loadingStatus" type="primary">Loading primary</v-button></li>
        <li><v-button :loading="true">Loading default</v-button></li>
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
#container {
  text-align: center;
}
ul {
  list-style: none;
  padding: 0;
}
ul li{
  margin: 10px auto;
  width: 100%;
}
ul li button {
  display: inline-block;
}
</style>
