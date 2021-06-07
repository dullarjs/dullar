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
  <q-button>default text</q-button>
  <q-button type="primary">primary text</q-button>
  <q-button disabled>disabled text</q-button>
  <q-button type="dashed">dashed</q-button>
  <q-button danger>danger default</q-button>
  <q-button danger type="primary">danger primary</q-button>
  <q-button danger type="dashed">danger dashed</q-button>
  <q-button loading type="primary">Loading</q-button>
  <q-button @click="handleClick" :loading="loadingStatus" type="primary">Loading</q-button>
  <q-button loading danger type="default">danger primary</q-button>
  <q-button textHideWhenLoading loading type="default">default</q-button>
  `;
  const jsCode =
  `
  export default class Button extends Vue {
    public loadingStatus = false;
    handleClick() {
      if (this.loadingStatus) {
        return;
      }
      this.loadingStatus = true;
      const timer = setTimeout(() => {
        this.loadingStatus = false;
        clearTimeout(timer);
      }, 5000);
    }
  }
  `;
  @Options({
    name: "ButtonCode"
  })
  export default class ButtonCode extends Vue {
    public exampleCode = exampleCode;
    public jsCode = jsCode;
    mounted() {
      document.querySelectorAll("pre code").forEach(block => window.Prism.highlightElement(block));
    }
  }
</script>