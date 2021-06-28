<template>
  <div class="spin-view">
    <div id="container">
      <ul>
        <li><q-spin></q-spin></li>
        <li><q-spin type="rotate" size="40"></q-spin></li>
        <li><q-spin type="triple-bounce" size="40"></q-spin></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
// import Queen from "../../src/component/Queen";
export default class Spin extends Vue {
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
ul li {
  margin: 20px auto;
}
</style>
