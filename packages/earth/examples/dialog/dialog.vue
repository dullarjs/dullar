<template>
  <div>
    <h2>yn-dialog</h2>
    <ul>
      <li @click="alert">Async alert</li>
      <li @click="syncAlert">Sync alert</li>
      <li @click="confirm">Sync cancel, Async confirm</li>
      <li @click="confirm2">Async cancel, Async confirm</li>
      <li @click="confirm3">html</li>
      <li>
        <span @click="advanced">advanced</span>
        <yn-dialog v-model="show" closeModelOnClick>
          <img src="https://img.yzcdn.cn/vant/apple-3.jpg" />
        </yn-dialog>
      </li>
      <li>
        <span @click="advanced2">advanced modal click callback</span>
        <yn-dialog
          :value="this.show2"
          @buttonClick="this.handleInput"
          @modalClick="this.handleClick"
        >
          <img src="https://img.yzcdn.cn/vant/apple-3.jpg" />
        </yn-dialog>
      </li>
      <li>
        <span @click="advanced3">异步加载数据渲染问题-{{ text.value }}</span>
        <yn-dialog v-model="show3" closeModelOnClick :beforeClose="handleBeforeClose">
          <span>我是固定内容，我后面的是动态内容{{ text.value }}</span>
        </yn-dialog>
      </li>
      <li @click="infinity">无限弹框</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "YnDialogPage",
  data() {
    return {
      show: false,
      show2: false,
      show3: false,
      text: {
        value: "默认内容"
      }
    };
  },
  methods: {
    handleAfterClose() {
      this.Toast("彻底关闭了");
    },
    advanced2() {
      this.show2 = true;
    },
    advanced() {
      this.show = true;
    },
    advanced3() {
      this.show3 = true;
      setTimeout(() => {
        // this.text = "内容要改变了";
        this.text = { value: "内容要改变了" };
      }, 3000);
    },
    handleInput(e) {
      console.log("按钮事件触发", e);
    },
    handleClick() {
      console.log("收到回调信息");
    },
    handleBeforeClose(e) {
      console.log("handleBeforeClose", e);
      if (e === "cancel") {
        return false;
      }
      return new Promise((resolve, reject) => {
        console.log(reject);
        setTimeout(() => {
          console.log("请求结束");
          resolve("请求结束");
        }, 2000);
      }).catch(err => {
        console.log("错误信息在这里展示", err);
      });
    },
    handleBeforeClose2(e) {
      console.log("这个是会告诉你点击了哪个按钮", e);
      return new Promise((resolve, reject) => {
        console.log(reject);
        setTimeout(() => {
          resolve("请求结束");
        }, 3000);
      }).catch(err => {
        console.log("错误信息在这里展示", err);
      });
    },
    alert() {
      this.Dialog.alert({
        title: "这个是标题",
        message: "这个是内容",
        confirmButtonText: "我知道了",
        confirmLoadingText: "",
        beforeClose: this.handleBeforeClose,
        // afterClose: this.handleAfterClose
      });
    },
    syncAlert() {
      this.Dialog.alert({ title: "这个是标题", message: "这个是内容" });
    },
    confirm() {
      this.Dialog.confirm({
        title: "这个是标题",
        message: "这个是内容",
        beforeClose: this.handleBeforeClose
      });
    },
    confirm2() {
      this.Dialog.confirm({
        title: "这个是标题",
        message: "这个是内容",
        beforeClose: this.handleBeforeClose2
      });
    },
    confirm3() {
      this.Dialog.confirm({
        title: "这个是标题",
        message: "<span>我是span标签</span><br/>我换行了",
        beforeClose: this.handleBeforeClose2
      });
    },
    infinity(e, i = 1) {
      this.Dialog.confirm({
        title: "无限弹框",
        message: `我是老${i}`,
        afterClose: (e) => {
          if (e === "confirm") {
            this.infinity(e, i + 1);
          }
        }
      });
    }
  }
};
</script>
<style type="text/css" scoped>
ul {
  padding: 0;
  margin: 0;
  text-align: center;
}
ul li {
  line-height: 44px;
  border-bottom: 1px solid #eeeeee;
}
.yn-dialog-content img {
  width: 100%;
}
</style>
