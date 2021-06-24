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
  <q-radiobox v-model="radiobox1" :disabled="true"></q-radiobox>
  <q-radiobox v-model="radiobox2"></q-radiobox>
  `;
  const jsCode =
  `
  export default class Radiobox extends Vue {
    public radiobox1 = true;
    public radiobox2 = false;
  }
  `;
  @Options({
    name: "RadioboxCode"
  })
  export default class RadioboxCode extends Vue {
    public exampleCode = exampleCode;
    public jsCode = jsCode;
    mounted() {
      document.querySelectorAll("pre code").forEach(block => window.Prism.highlightElement(block));
    }
  }
</script>