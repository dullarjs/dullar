<template>
  <div class="code">
    <h3>html</h3>
    <pre><code class="lang-html">{{ exampleCode }}</code></pre>
  </div>
</template>
<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  const exampleCode =
  `
 <q-calendar
   before="10"
   after="10"
   v-model="calendar1"
   v-on:getdate="getDate"
 ></q-calendar>
 <q-calendar
   before="10"
   after="10"
   mode="double"
   v-on:getdate="getDate"
   v-model="calendar2"
 ></q-calendar>
 <q-calendar
   mode="single"
   :before="10"
   :after="10"
   v-model="calendar3"
   :defaultDate="defaultDate"
   v-on:getdate="getDate"
 ></q-calendar>
 <q-calendar
   mode="double"
   :before="10"
   :after="10"
   v-model="calendar4"
   :defaultStartDate="defaultStartDate"
   :defaultEndDate="defaultEndDate"
   v-on:getdate="getDate"
 ></q-calendar>
 <q-calendar
   mode="double"
   :before="10"
   :after="10"
   v-model="calendar5"
   v-on:getdate="getDate"
   :showConfirmButton="true"
 ></q-calendar>
 <q-calendar
   mode="double"
   :before="10"
   :after="10"
   v-model="calendar6"
   v-on:getdate="getDate"
   :doubleModeAllowSameDate="true"
 ></q-calendar>
  `;
  @Options({
    name: "CalendarCode"
  })
  export default class CalendarCode extends Vue {
    public exampleCode = exampleCode;
    mounted() {
      document.querySelectorAll("pre code").forEach(block => window.Prism.highlightElement(block));
    }
  }
</script>