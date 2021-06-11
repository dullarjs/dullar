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
 <q-citypicker
   :searchable="false"
   @pick="handlePick"
   v-model="picker1"
   :tabs="tabs1"
   :alphaBeta="getAlphaBeta()"
   :history="getHistory()"
   :hotCity="getHotCity()"
   showHistory
 ></q-citypicker>
 <q-citypicker
   :alphaBeta="getAlphaBeta()"
   :history="getHistory()"
   :hotCity="getHotCity()"
   showHistory
   :searchable="false"
   @pick="handlePick"
   v-model="picker2"
   :tabs="tabs2"
 ></q-citypicker>
 <q-citypicker
   :alphaBeta="getAlphaBeta()"
   :history="getHistory()"
   :hotCity="getHotCity()"
   :searchable="false"
   @pick="handlePick"
   v-model="picker3"
 ></q-citypicker>
 <q-citypicker
   @pick="handlePick"
   v-model="picker4"
   :limitedData="data.cnCitiesList"
   limited
 ></q-citypicker>
 <q-citypicker
   @pick="handlePick"
   v-model="picker5"
   :hotCity="getHotCity()"
   showHistory
   :history="getHistory()"
   :alphaBeta="getAlphaBeta()"
 ></q-citypicker>
 <q-citypicker
   :alphaBeta="getAlphaBeta()"
   :searchable="false"
   @pick="handlePick"
   v-model="picker6"
   :tabs="tabs2"
   :showHotCity="false"
 ></q-citypicker>
 <q-citypicker
   :search="getSearch()"
   :alphaBeta="getAlphaBeta()"
   :history="getHistory()"
   :hotCity="getHotCity()"
   showHistory
   @pick="handlePick"
   v-model="picker7"
 ></q-citypicker>
 <q-citypicker
   :search="getSearch()"
   :alphaBeta="getAlphaBeta()"
   :history="getHistory()"
   :hotCity="getHotCity()"
   showHistory
   @pick="handlePick"
   v-model="picker8"
   column="3"
 ></q-citypicker>
  `;
  const jsCode =
  `
 const data = require("./cities.json").result;
 // import Queen from "../../src/component/Queen";
 export default class Citypicker extends Vue {
   public data = data;
   public picker1 = false;
   public picker2 = false;
   public picker3 = false;
   public picker4 = false;
   public picker5 = false;
   public picker6 = false;
   public picker7 = false;
   public picker8 = false;
   public tabs1 = [{ label: "中国", key: "mainland-china" }];
   public tabs2 = [{ label: "非中国大陆(国际/港澳台)", key: "overseas" }];
   getSearch() {
     return {
       params: { a: "1", b: "2" },
       action: this.getSearchAction,
       parse: (e, params = {}) => {
         const { tab } = params;
         if (tab === "mainland-china") {
           return e.cnCitiesList;
         } else if (tab === "overseas") {
           return e.intCitiesList;
         }
       }
     };
   }
   getSearchAction(params = {}) {
     console.log("这里处理请求的参数", params);
     return new Promise((resolve, reject) => {
       console.log(reject);
       // setTimeout(() => {
       //   reject("失败信息");
       // }, 1000);
       setTimeout(() => {
         resolve(data);
       }, 1000);
     }).catch(err => {
       this.Toast(err);
       console.log(err, "异常在组件外面处理");
     });
   }
   getHistory() {
     return {
       title: "历史查询",
       params: { a: "1", b: "2" },
       action: this.getHistoryAction,
       parse: (e: any, params = {}) => {
         const { tab } = params;
         if (tab === "mainland-china") {
           return e.cnCitiesList;
         } else if (tab === "overseas") {
           return e.intCitiesList;
         }
       }
     };
   }
   getHistoryAction(params = {}) {
     console.log("这里处理请求的参数", params);
     return new Promise((resolve, reject) => {
       console.log(reject);
       // setTimeout(() => {
       //   reject("失败信息");
       // }, 1000);
       setTimeout(() => {
         resolve(data);
       }, 1000);
     }).catch(err => {
       this.Toast(err);
       console.log(err, "异常在组件外面处理");
     });
   }
   handlePicker(num: number): void {
     this[\`picker\${num}\`] = !this[\`picker\${num}\`];
   }
   handlePick(e: any): void {
     this.Toast(\`已选择：\${e.CityName}\`);
   }
   getCityListByAlphaBeta(params = {} as any) {
     console.log("这里处理请求的参数", params);
     return new Promise((resolve, reject) => {
       console.log(reject);
       // setTimeout(() => {
       //   reject("失败信息");
       // }, 1000);
       setTimeout(() => {
         resolve(data);
       }, 1000);
     }).catch(err => {
       this.Toast(err);
       console.log(err, "异常在组件外面处理");
     });
   }
   getAlphaBeta() {
     return {
       title: "按字母查询",
       params: { a: "1", b: "2" },
       action: this.getCityListByAlphaBeta,
       parse: e => {
         return e.cnCitiesList;
       }
     };
   }
   getHotCity() {
     return {
       title: "热门城市",
       params: { a: "1", b: "2" },
       action: this.getHotCityAction,
       parse: (e, params = {}) => {
         const { tab } = params;
         if (tab === "mainland-china") {
           return e.cnCitiesList;
         } else if (tab === "overseas") {
           return e.intCitiesList;
         }
       }
     };
   }
   getHotCityAction(params = {} as any) {
     console.log("这里处理请求的参数", params);
     return new Promise((resolve, reject) => {
       // setTimeout(() => {
       //   reject("失败信息");
       // }, 1000);
       console.log(reject);
       setTimeout(() => {
         resolve(data);
       }, 1000);
     }).catch(err => {
       this.Toast(err);
       console.log(err, "异常在组件外面处理");
     });
   }
 }
  `;
  @Options({
    name: "CitypickerCode"
  })
  export default class CitypickerCode extends Vue {
    public exampleCode = exampleCode;
    public jsCode = jsCode;
    mounted() {
      document.querySelectorAll("pre code").forEach(block => window.Prism.highlightElement(block));
    }
  }
</script>