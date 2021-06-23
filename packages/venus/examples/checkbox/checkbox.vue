<template>
  <div class="checkbox-view">
    <div id="container">
      <p>
        <span>checked disabled</span>
        <v-checkbox v-model="checkbox1" :disabled="true"></v-checkbox>
      </p>
      <p>
        <span>unchecked disabled</span>
        <v-checkbox v-model="checkbox3" :disabled="true"></v-checkbox>
      </p>
      <p>
        <span>{{ checkbox2 }}</span>
        <v-checkbox v-model="checkbox2"></v-checkbox>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
export default class Checkbox extends Vue {
  public checkbox1 = true;
  public checkbox2 = false;
  public checkbox3 = false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
