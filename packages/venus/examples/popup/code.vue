<template>
  <div class="code">
    <h3>html</h3>
    <pre><code class="lang-html">{{ exampleCode }}</code></pre>
    <h3>js</h3>
    <pre><code class="lang-js">{{ jsCode }}</code></pre>
  </div>
</template>
<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  const exampleCode =
  `
  <template>
    <div class="spin-view">
      <div id="container">
        <ul>
          <li @click="showPopup1()">底部</li>
          <li @click="showPopup2()">右侧</li>
          <li @click="showPopup3()">上面</li>
          <li @click="showPopup4()">双层嵌套</li>
          <li @click="showPopup6()">中间</li>
        </ul>
      </div>
      <q-popup v-model="popup1" position="bottom">
        <div class="popup-content">
          底部出现遮罩
          <template :key="item" v-for="item in 10">
            <h3>我是{{ item }}</h3>
          </template>
        </div>
      </q-popup>
      <q-popup v-model="popup2" position="right" :showCloseIcon="true">
        <div class="popup-content">右侧出现遮罩</div>
      </q-popup>
      <q-popup v-model="popup3" position="top" :showCloseIcon="true">
        <div class="popup-content">上面出现遮罩</div>
      </q-popup>
      <q-popup v-model="popup4" position="bottom" :showCloseIcon="true">
        <div class="popup-content">
          <span @click="showPopup5()">打开内层</span>
          上面出现遮罩
          <q-popup v-model="popup5" position="bottom">
            <div class="popup-content">
              内层嵌套
            </div>
          </q-popup>
        </div>
      </q-popup>
      <q-popup v-model="popup6" position="middle" :showCloseIcon="true" fixed>
        <div class="popup-content">中间fade</div>
      </q-popup>
    </div>
  </template>
  `;
  const jsCode =
  `
  export default class Spin extends Vue {
    popup1 = false;
    popup2 = false;
    popup3 = false;
    popup4 = false;
    popup5 = false;
    popup6 = false;
    showPopup1() {
      this.popup1 = true;
    }
    showPopup2() {
      this.popup2 = true;
    }
    showPopup3() {
      this.popup3 = true;
    }
    showPopup4() {
      this.popup4 = true;
    }
    showPopup5() {
      this.popup5 = true;
    }
    showPopup6() {
      this.popup6 = true;
    }
  }
  `;
  @Options({
    name: "PopupCode"
  })
  export default class PopupCode extends Vue {
    public exampleCode = exampleCode;
    public jsCode = jsCode;
    mounted() {
      document.querySelectorAll("pre code").forEach(block => window.Prism.highlightElement(block));
    }
  }
</script>