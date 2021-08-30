<template>
  <div class="spin">
    <div>
      <h4>triple-bounce</h4>
      <yn-spin type="triple-bounce"></yn-spin>
    </div>
    <div>
      <h4>default snake</h4>
      <yn-spin type="snake"></yn-spin>
    </div>
    <div>
      <h4>snake set borderWidth as 2</h4>
      <yn-spin borderWidth="2" type="snake"></yn-spin>
    </div>
    <div>
      <h4>fading-circle</h4>
      <yn-spin type="fading-circle"></yn-spin>
    </div>
    <div>
      <h4>double-bounce</h4>
      <yn-spin type="double-bounce"></yn-spin>
    </div>
    <div>
      <h4>rotate</h4>
      <yn-spin type="rotate" :size="50"></yn-spin>
    </div>
    <div>
      <h4>rotate svg</h4>
      <yn-spin type="rotate-svg" size="40"></yn-spin>
    </div>
  </div>
</template>

<script>
export default {
  name: "YnSpinPage"
};
</script>
