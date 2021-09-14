<template>
  <div>
    <h2>yn-slide</h2>
    <ul>
      <li>
        <yn-slide class="one" ref="slide">
          <template v-slot:content>一个按钮，尝试左滑呢？</template>
          <template v-slot:buttons>
            <span class="buttons" @click="handleClick('确认', true)">确定</span>
          </template>
        </yn-slide>
      </li>
      <li>
        <yn-slide class="two">
          <template v-slot:content>两个按钮，尝试左滑呢？</template>
          <template v-slot:buttons>
            <span class="buttons" @click="handleClick('确认')">确定</span>
            <span class="buttons" @click="handleClick('删除')">删除</span>
          </template>
        </yn-slide>
      </li>
      <li>
        <yn-slide class="three">
          <template v-slot:content>三个按钮，尝试左滑呢？</template>
          <template v-slot:buttons>
            <span class="buttons" @click="handleClick('确认')">确定</span>
            <span class="buttons" @click="handleClick('删除')">删除</span>
            <span class="buttons" @click="handleClick('编辑')">编辑</span>
          </template>
        </yn-slide>
      </li>
    </ul>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "YnSlidePage",
  data() {
    return {
    };
  },
  methods: {
    handleClick(msg, reset = false) {
      this.Toast(msg);
      if (reset) {
        this.$refs.slide.reset();
      }
    }
  }
};
</script>
<style type="text/css" scoped="scoped">
  ul {
    padding: 0;
    margin: 0;
  }
  li {
    text-align: center;
    list-style: none;
    height: 40px;
    line-height: 40px;
    color: #ccc;
    background: #ccc;
    margin: 20px auto;
  }
  .one {
    background: red;
  }
  .two {
    background: yellow;
  }
  .three {
    background: green;
  }
  .buttons {
    background: #eee;
    color: #fff;
    display: inline-block;
  }
</style>
