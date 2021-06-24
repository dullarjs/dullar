<template>
  <div class="swipe-view">
    <div id="container">
      <h3>左右滑动轮播图</h3>
      <v-swipe loadingText="自定义文案支持图片加载..." ref="swipe1" indicatorType="number">
        <v-swipe-item>
          <div>
            <img src="./images/10b85799aaec02b8.jpg.webp" />
          </div>
        </v-swipe-item>
        <v-swipe-item>
          <img src="./images/2bf20652dea5a31c.jpg.webp" />
        </v-swipe-item>
        <v-swipe-item>
          <img src="./images/6aea07539da1e50b.jpg.webp" />
        </v-swipe-item>
        <v-swipe-item>
          <img src="./images/8bcbb2319250a096.jpg.webp" />
        </v-swipe-item>
        <v-swipe-item>
          <img src="./images/9d77908c732efd81.jpg.webp" />
        </v-swipe-item>
        <v-swipe-item>
          <img src="./images/b16f106fab634623.jpg.webp" />
        </v-swipe-item>
        <v-swipe-item>
          <img src="./images/d1d5846840468d75.jpg.webp" />
        </v-swipe-item>
      </v-swipe>
      <h3>上下滑动轮播图</h3>
      <v-swipe ref="swipe2" :vertical="true">
        <v-swipe-item>
          <div>
            <img src="./images/10b85799aaec02b8.jpg.webp" />
          </div>
        </v-swipe-item>
        <v-swipe-item>
          <img src="./images/2bf20652dea5a31c.jpg.webp" />
        </v-swipe-item>
        <v-swipe-item>
          <img src="./images/6aea07539da1e50b.jpg.webp" />
        </v-swipe-item>
        <v-swipe-item>
          <img src="./images/8bcbb2319250a096.jpg.webp" />
        </v-swipe-item>
        <v-swipe-item>
          <img src="./images/9d77908c732efd81.jpg.webp" />
        </v-swipe-item>
        <v-swipe-item>
          <img src="./images/b16f106fab634623.jpg.webp" />
        </v-swipe-item>
        <v-swipe-item>
          <img src="./images/d1d5846840468d75.jpg.webp" />
        </v-swipe-item>
      </v-swipe>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
// import Queen from "../../src/component/Queen";
export default class Swipe extends Vue {
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
