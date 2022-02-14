<template>
  <div class="city-picker-page">
    <cityPicker></cityPicker>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import "./style/index.scss";
import { Component } from "vue-property-decorator";
@Component({
  name: "cityPickerPage"
})
export default class CityPickerPage extends Vue {
}
</script>

