<template>
  <div class="checkbox-view">
    <div id="container">
      <span>disabled</span>
      <q-checkbox v-model="checkbox1" :disabled="true"></q-checkbox>
      <hr>
      <span>{{ checkbox2 }}</span>
      <q-checkbox v-model="checkbox2"></q-checkbox>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
export default class Checkbox extends Vue {
  public checkbox1 = true;
  public checkbox2 = false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
