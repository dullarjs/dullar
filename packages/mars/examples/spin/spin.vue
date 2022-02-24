<template>
  <div class="spin-page">
    <div>
      <h4>triple-bounce</h4>
      <m-spin type="triple-bounce"></m-spin>
    </div>
    <div>
      <h4>default snake</h4>
      <m-spin type="snake"></m-spin>
    </div>
    <div>
      <h4>snake set borderWidth as 2</h4>
      <m-spin borderWidth="2" type="snake"></m-spin>
    </div>
    <div>
      <h4>fading-circle</h4>
      <m-spin type="fading-circle"></m-spin>
    </div>
    <div>
      <h4>double-bounce</h4>
      <m-spin type="double-bounce"></m-spin>
    </div>
    <div>
      <h4>rotate</h4>
      <m-spin type="rotate" :size="50"></m-spin>
    </div>
    <div>
      <h4>rotate svg</h4>
      <m-spin type="rotate-svg" size="40"></m-spin>
    </div>
  </div>
</template>

<script>
export default {
  name: "SpinPage"
};
</script>
