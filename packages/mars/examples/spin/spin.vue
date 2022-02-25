<template>
  <div class="spin-page">
    <div>
      <h4>triple-bounce</h4>
      <Yn-spin type="triple-bounce"></Yn-spin>
    </div>
    <div>
      <h4>default snake</h4>
      <Yn-spin type="snake"></Yn-spin>
    </div>
    <div>
      <h4>snake set borderWidth as 2</h4>
      <Yn-spin borderWidth="2" type="snake"></Yn-spin>
    </div>
    <div>
      <h4>fading-circle</h4>
      <Yn-spin type="fading-circle"></Yn-spin>
    </div>
    <div>
      <h4>double-bounce</h4>
      <Yn-spin type="double-bounce"></Yn-spin>
    </div>
    <div>
      <h4>rotate</h4>
      <Yn-spin type="rotate" :size="50"></Yn-spin>
    </div>
    <div>
      <h4>rotate svg</h4>
      <Yn-spin type="rotate-svg" size="40"></Yn-spin>
    </div>
  </div>
</template>

<script>
export default {
  name: "SpinPage"
};
</script>
