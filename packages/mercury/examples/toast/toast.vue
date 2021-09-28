<template>
  <div>
    <h2>yn-toast</h2>
    <ul>
      <li @click="toast('middle')">toast middle</li>
      <li @click="toast('bottom')">toast bottom</li>
      <li @click="functional">functional toast</li>
    </ul>
  </div>
</template>
<script type="text/javascript">
import { YnToast } from "@";
export default {
  name: "YnToastPage",
  data() {
    return {};
  },
  methods: {
    functional() {
      YnToast("this is functional toast");
    },
    toast(position) {
      this.Toast({ message: `hello , ${position}`, position });
    }
  }
};
</script>
