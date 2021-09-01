<template>
  <div>
    <h2>yn-counter</h2>
    <span>total {{ total }}</span>
    <ul>
      <li v-for="(count, i) in counts" :key="i">
        <yn-counter :name="count.name" :key="i" v-model="count.value" :min="count.min" :max="count.max" steps="1" @change="handleChange"></yn-counter>
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
        counts: [{ value: 0, min: -5, max: 10, name: "haha" }, { value: 1, min: -2, max: 120, name: "hehe" }, { value: 2, min: 1, max: 4, name: "heihei" }]
      };
    },
    computed: {
      total() {
        let result = 0;
        this.counts.forEach(e => {
          result += e.value;
        });
        return result;
      }
    },
    methods: {
      secondChange() {
        const count = this.counts[1];
        count.value = 100;
        this.counts.splice(1, 1, count);
      },
      handleChange(e) {
        console.log(e);
        this.Toast(`${e.name} - ${e.type}`);
      }
    }
  };
</script>

<style type="text/css" scoped="scoped">
  ul li {
    margin: 10px;
  }
</style>
