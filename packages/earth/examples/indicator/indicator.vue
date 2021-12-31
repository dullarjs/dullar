<template>
  <div>
    <h2>yn-indicator</h2>
    <ul>
      <li @click="indicator('doubleBounce')">doubleBounce</li>
      <li @click="indicator('fadingCircle')">fadingCircle</li>
      <li @click="indicator('snake')">snake</li>
      <li @click="indicator('tripleBounce')">tripleBounce</li>
      <li @click="indicator('rotate', false)">rotate lockScreen</li>
      <li @click="indicator('rotate', true)">rotate lockScreen transparent</li>
    </ul>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "YnIndicatorPage",
  data() {
    return {};
  },
  methods: {
    indicator(spinType, transparent) {
      if (spinType === "rotate") {
        this.Indicator.open({ spinType, background: "#fff", lockScreen: true, transparent });
      } else {
        this.Indicator.open({ text: spinType, spinType });
      }
      const timer = setTimeout(() => {
        this.Indicator.close();
        clearTimeout(timer);
      }, 3000);
    }
  }
};
</script>
