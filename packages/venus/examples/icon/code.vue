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
  <q-icon name="close"></q-icon>
  <q-icon name="location"></q-icon>
  `;
  @Options({
    name: "IconCode"
  })
  export default class IconCode extends Vue {
    public exampleCode = exampleCode;
    mounted() {
      document.querySelectorAll("pre code").forEach(block => window.Prism.highlightElement(block));
    }
  }
</script>