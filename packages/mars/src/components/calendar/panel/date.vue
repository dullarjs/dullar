<template>
  <transition name="el-zoom-in-top">
    <div
      v-show="visible"
      class="el-picker-panel el-date-picker el-popper"
      :class="[]">
      data-panel
    </div>
  </transition>
</template>

<script type="text/babel">

  export default {
    data() {
      return {
        visible: false
      }
    }
  };
</script>
