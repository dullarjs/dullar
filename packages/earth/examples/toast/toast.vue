<template>
  <div>
    <h2>yn-toast</h2>
    <ul>
      <li @click="toast('middle')">toast middle</li>
      <li @click="toast('bottom')">toast bottom</li>
    </ul>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "YnToastPage",
  data() {
    return {};
  },
  methods: {
    toast(position) {
      this.Toast({ message: `hello , ${position}`, position });
    }
  }
};
</script>
