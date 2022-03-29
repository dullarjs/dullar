<template>
  <transition name="el-zoom-in-top" @after-leave="$emit('dodestroy')">
    <div
      v-show="visible"
      class="el-picker-panel el-date-range-picker el-popper"
      :class="[]">
      date-range-panel
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
  }
</script>
