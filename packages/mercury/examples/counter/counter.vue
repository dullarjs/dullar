<template>
  <div>
    <h2>yn-counter</h2>
    <span>total {{ total }}</span>
    <ul>
      <li v-for="(count, i) in counts" :key="i">
        <yn-counter
          :name="count.name"
          :key="i"
          :editable="count.editable"
          v-model="count.value"
          :min="count.min"
          :max="count.max"
          :autofocus="count.autofocus"
          steps="1"
          @change="handleChange"
          @error="handleError"
        ></yn-counter>
      </li>
    </ul>
    <yn-button @click="secondChange">修改第二个</yn-button>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "YnCounterPage",
  data() {
    return {
      counts: [
        {
          value: 0,
          min: -5,
          max: 10,
          name: "haha",
          editable: true,
          autofocus: false,
        },
        {
          value: 1,
          min: -2,
          max: 10000002,
          name: "hehe",
          editable: true,
          autofocus: true,
        },
        { value: 2, min: 1, max: 4, name: "heihei" },
      ],
    };
  },
  computed: {
    total() {
      let result = 0;
      this.counts.forEach((e) => {
        result += e.value;
      });
      return result;
    },
  },
  methods: {
    secondChange() {
      const count = this.counts[1];
      count.value = 10000000;
      this.counts.splice(1, 1, count);
    },
    handleChange(e) {
      console.log(e);
      this.Toast(`${e.name} - ${e.type}`);
    },
    handleError(e) {
      console.log("handleError", e);
    },
  },
};
</script>

<style type="text/css" scoped="scoped">
ul li {
  margin: 10px;
  list-style: none;
}
</style>
