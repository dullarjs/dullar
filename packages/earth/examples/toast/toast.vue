<template>
  <div>
    <h2>yn-toast</h2>
    <ul>
      <li @click="toast('middle')">toast middle</li>
      <li @click="toast('bottom')">toast bottom</li>
      <li @click="toast('top')">toast top</li>
      <li @click="toast1">toast default</li>
      <li>
        <a ref="sms" @click="sendSMS">发送短信</a>
      </li>
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
    isIOS() {
      const ua = window.navigator.userAgent;
      return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端;
    },
    sendSMS() {
      if (this.isIOS()) {
        this.$refs.sms.setAttribute("href", "sms:10086&body=888");
      } else {
        this.$refs.sms.setAttribute("href", "sms:10086?body=888");
      }
    },
    toast(position) {
      this.Toast({ message: `hello , ${position}`, position });
    },
    toast1() {
      this.Toast({ message: `hello , default` });
    }
  }
};
</script>
