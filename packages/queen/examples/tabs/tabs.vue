<template>
  <div class="tabs-view">
    <div id="container">
      <div class="box">
        <q-tabs v-model="active0">
          <q-tab-item title="tab111" name="111111">1</q-tab-item>
          <q-tab-item title="tab222" name="22222">2</q-tab-item>
          <q-tab-item title="tab333" name="33333">3</q-tab-item>
        </q-tabs>
      </div>
      <div class="box">
        <q-tabs v-model="active" @change="change">
          <q-tab-item :key="index" :name="'tab-' + index" :title="'Tab' + index" v-for="index in 4">
            content of tab {{ index }}
          </q-tab-item>
          <q-tab-item :key="`item—${index}`" :name="'item-' + index" :title="'Tab' + index" v-for="index in 4">
            content of tab {{ `item-${index}` }}
          </q-tab-item>
        </q-tabs>
      </div>
      <div class="box">
        <q-tabs v-model="active1" @click="handleClick">
          <q-tab-item
            :key="index"
            :name="'tab-' + index"
            :title="'Tab' + index"
            v-for="index in 8"
            :disabled="index === 4"
          >
            content of tab {{ index }}
          </q-tab-item>
        </q-tabs>
      </div>
      <div class="box">
        <q-tabs v-model="active2">
          <q-tab-item :key="index" :name="'Tab-' + index" :title="'Tab' + index" v-for="index in 2">
            content of tab {{ index }}
          </q-tab-item>
        </q-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
// import VueGgy from "../../src/component/VueGgy";
export default class Tabs extends Vue {
  public active0 = "111111";
  public active = "tab-1";
  public active1 = "tab-1";
  public active2 = "Tab-1";
  change(e: any) {
    this.Toast(`${e.value} changed`);
  }
  handleClick(e: any) {
    if (e.disabled) {
      this.Toast(`${e.value} is disabled`);
    } else {
      this.Toast(`${e.value} clicked`);
    }
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
  margin: 20px auto;
}
</style>
