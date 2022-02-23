<template>
  <div class="spin">
    <div>
      <h4>triple-bounce</h4>
      <spin type="triple-bounce"></spin>
    </div>
    <div>
      <h4>default snake</h4>
      <spin type="snake"></spin>
    </div>
    <div>
      <h4>snake set borderWidth as 2</h4>
      <spin borderWidth="2" type="snake"></spin>
    </div>
    <div>
      <h4>fading-circle</h4>
      <spin type="fading-circle"></spin>
    </div>
    <div>
      <h4>double-bounce</h4>
      <spin type="double-bounce"></spin>
    </div>
    <div>
      <h4>rotate</h4>
      <spin type="rotate" :size="50"></spin>
    </div>
    <div>
      <h4>rotate svg</h4>
      <spin type="rotate-svg" size="40"></spin>
    </div>
  </div>
</template>

<script>
export default {
  name: "SpinPage"
};
</script>
