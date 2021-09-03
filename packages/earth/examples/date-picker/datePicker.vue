<template>
  <div>
    <h2>yn-date-picker</h2>
    <ul>
      <li @click="handleClick(1)">默认</li>
      <li @click="handleClick(2)">指定起止日期</li>
    </ul>
    <yn-date-picker v-model="show1" @confirm="handleConfirm"></yn-date-picker>
    <yn-date-picker
      v-model="show2"
      start="2021-01-21"
      end="2031-12-30"
      defaultDate="2021-01-21"
      confirmText="confirm"
      cancelText="cancel"
      title="Date"
      @confirm="handleConfirm"
    ></yn-date-picker>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "YnDatePickerPage",
  data() {
    return {
      show1: false,
      show2: false
    };
  },
  methods: {
    handleConfirm(e) {
      console.log(e);
    },
    handleClick(i) {
      this[`show${i}`] = !this[`show${i}`];
    }
  }
};
</script>
