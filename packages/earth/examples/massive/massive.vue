<template>
  <div>
    <h2>massive</h2>
    <ul>
      <li v-for="i in 10" v-bind:key="i">{{i}}</li>
      <!-- <li v-for="i in 100000" v-bind:key="i">{{i}}</li> -->
    </ul>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: "YnMassivePage",
    mounted() {
      for (let i = 0; i < 100000; i++) {
        console.log(i);
      }
    }
  };
</script>
