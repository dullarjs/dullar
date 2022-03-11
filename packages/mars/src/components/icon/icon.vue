<template>
  <i :class="'yn-icon-' + name"></i>
</template>

<script lang="ts">
  import "./style/index.scss";
  import Vue from "vue";
  import { Component, Prop } from "vue-property-decorator";
  @Component({
    name: "Icon"
  })
  export default class Icon extends Vue {
    static componentName = 'YnIcon';

    @Prop({
      type: String
    })
    name!: string;
  }
</script>
