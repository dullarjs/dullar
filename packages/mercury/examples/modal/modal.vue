<template>
  <div>
    <h2>yn-modal</h2>
    <hr />
    <ul>
      <li>
        <yn-button @click="handleClick(6)">中间fade</yn-button>
      </li>
      <li>
        <yn-button @click="handleClick(4)">双层嵌套</yn-button>
      </li>
      <li>
        <yn-button @click="handleClick(1)">插槽</yn-button>
      </li>
        <li>
        <yn-button @click="handleClick(2)">插槽2</yn-button>
      </li>
    </ul>
    <yn-modal
      v-model="modal6"
      :showCloseIcon="true"
      :beforeClose="this.handleBeforeClose"
    >
      <div class="modal-content">中间fade</div>
    </yn-modal>
    <yn-modal v-model="modal4" :showCloseIcon="true">
      <div class="modal-content">
        <yn-button @click="handleClick(5)">打开内层</yn-button>
        上面出现遮罩
        <yn-modal v-model="modal5">
          <div class="modal-content">内层嵌套</div>
        </yn-modal>
      </div>
    </yn-modal>
    <yn-modal
      v-model="modal1"
      :beforeClose="this.handleBeforeClose"
      :showFooter="false"
      :showHeader="true"
      :showCloseIcon="false"
    >
      <!-- <div slot="header">header</div> -->
      <div slot="icon">icon</div>
      <div>content</div>
      <div slot="footer">footer</div>
    </yn-modal>
    <yn-modal
      v-model="modal2"
      :beforeClose="this.handleBeforeClose"
      :showFooter="false"
      :showHeader="false"
    >
      <div slot="header">header</div>
      <div>content</div>
      <div slot="footer">footer</div>
    </yn-modal>
  </div>
</template>
<style>
.modal-content {
  width: 100%;
  min-height: 200px;
  background: #fff;
}
</style>
<script>
export default {
  name: "YnModalPage",
  data() {
    return {
      modal1: false,
      modal2: false,
      modal3: false,
      modal4: false,
      modal5: false,
      modal6: false,
    };
  },
  methods: {
    handleClick(num) {
      this[`modal${num}`] = !this[`modal${num}`];
    },
    handleBeforeClose(e) {
      console.log("这个是会告诉你点击了哪个按钮", e);
      return new Promise((resolve, reject) => {
        console.log(reject);
        setTimeout(() => {
          resolve("请求结束");
        }, 3000);
      }).catch((err) => {
        console.log("错误信息在这里展示", err);
      });
    },
  },
};
</script>
<style type="text/css" scoped="scoped">
ul {
  list-style: none;
}
ul li {
  margin: 10px auto;
}
</style>
