<template>
  <div>
    <h2>yn-flex 在学不会flex说不过去啊</h2>
    <a target="_blank" href="https://wow.techbrood.com/fiddle/8177"
      >查看原案例</a
    >
    <yn-flex justifyContent="center" alignItems="center" class="face">
      <transition>
        <!-- 加一层<transition>也是可以的，其他元素就不行了哦，暂时不支持<transition-group> -->
        <yn-flex-item class="dot"></yn-flex-item>
      </transition>
    </yn-flex>
    <hr />
    <yn-flex justifyContent="spaceBetween" class="face">
      <yn-flex-item class="dot"></yn-flex-item>
      <yn-flex-item class="dot" align-self="flex-end"></yn-flex-item>
    </yn-flex>
    <hr />
    <yn-flex justifyContent="spaceBetween" class="face">
      <yn-flex-item class="dot"></yn-flex-item>
      <yn-flex-item class="dot" align-self="center"></yn-flex-item>
      <yn-flex-item class="dot" align-self="flex-end"></yn-flex-item>
    </yn-flex>
    <hr />
    <yn-flex justifyContent="spaceBetween" flexDirection="column" class="face">
      <yn-flex-item>
        <yn-flex justifyContent="spaceBetween">
          <yn-flex-item class="dot"></yn-flex-item>
          <yn-flex-item class="dot"></yn-flex-item>
        </yn-flex>
      </yn-flex-item>
      <yn-flex-item>
        <yn-flex justifyContent="spaceBetween">
          <yn-flex-item class="dot"></yn-flex-item>
          <yn-flex-item class="dot"></yn-flex-item>
        </yn-flex>
      </yn-flex-item>
    </yn-flex>
    <hr />
    <yn-flex justifyContent="spaceBetween" flexDirection="column" class="face">
      <yn-flex-item>
        <yn-flex justifyContent="spaceBetween">
          <yn-flex-item class="dot"></yn-flex-item>
          <yn-flex-item class="dot"></yn-flex-item>
        </yn-flex>
      </yn-flex-item>
      <yn-flex-item>
        <yn-flex justify-content="center">
          <yn-flex-item class="dot"></yn-flex-item>
        </yn-flex>
      </yn-flex-item>
      <yn-flex-item>
        <yn-flex justifyContent="spaceBetween">
          <yn-flex-item class="dot"></yn-flex-item>
          <yn-flex-item class="dot"></yn-flex-item>
        </yn-flex>
      </yn-flex-item>
    </yn-flex>
    <hr />
    <yn-flex justifyContent="spaceBetween" flexDirection="column" class="face">
      <yn-flex-item>
        <yn-flex justifyContent="spaceBetween">
          <yn-flex-item class="dot"></yn-flex-item>
          <yn-flex-item class="dot"></yn-flex-item>
        </yn-flex>
      </yn-flex-item>
      <yn-flex-item>
        <yn-flex justify-content="spaceBetween">
          <yn-flex-item class="dot"></yn-flex-item>
          <yn-flex-item class="dot"></yn-flex-item>
        </yn-flex>
      </yn-flex-item>
      <yn-flex-item>
        <yn-flex justifyContent="spaceBetween">
          <yn-flex-item class="dot"></yn-flex-item>
          <yn-flex-item class="dot"></yn-flex-item>
        </yn-flex>
      </yn-flex-item>
    </yn-flex>
  </div>
</template>
<script>
export default {
  name: "YnFlexPage",
  data() {
    return {};
  }
};
</script>
<style>
.face {
  margin: 16px;
  padding: 4px;
  background-color: #e7e7e7;
  width: 104px;
  height: 104px;
  -o-object-fit: contain;
  object-fit: contain;
  box-shadow: inset 0 5px white, inset 0 -5px #bbb, inset 5px 0 #d7d7d7,
    inset -5px 0 #d7d7d7;
  border-radius: 10%;
}
.dot {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin: 4px;
  background-color: #333;
  box-shadow: inset 0 3px #111, inset 0 -3px #555;
}
</style>
