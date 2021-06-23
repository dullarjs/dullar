<template>
  <div class="toast-view">
    <div id="container">
      <ul>
        <li @click="t('middle', 'middle')">middle</li>
        <li @click="t('bottom', 'bottom')">bottom</li>
        <li @click="t('top', 'top')">top</li>
        <li @click="t('bottom', '提示文案最好控制在十六个字以内')">max length text</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
// import Queen from "../../src/component/Queen";
export default class Toast extends Vue {
  t(position: string, message: string): void  {
    this.Toast({ position, message });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  user-select: none;
  margin: 0;
}
li {
  border-top: 1px solid #e4e4e4;
  line-height: 44px;
  cursor: pointer;
  color: #000;
  font-size: 20px;
  margin: 10px auto;
  background: #f7f8fa;
  border-radius: 30px;
  width: 92%;
  text-align: left;
  text-indent: 1em;
}
</style>
