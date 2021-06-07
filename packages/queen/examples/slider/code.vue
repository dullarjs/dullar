<template>
  <div class="code">
    <h3>html</h3>
    <pre><code class="lang-html">{{ htmlCode }}</code></pre>
  </div>
</template>
<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  const htmlCode =
  `
  <q-slider v-model="value"></q-slider>
  `;
  @Options({
    name: "SliderCode"
  })
  export default class SliderCode extends Vue {
    public htmlCode = htmlCode;
    mounted() {
      document.querySelectorAll("pre code").forEach(block => window.Prism.highlightElement(block));
    }
  }
</script>