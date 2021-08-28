<template>
  <div class="tree-box">
    <h2>yn-tree</h2>
    <yn-tree :data="data" @pick="handlePicked"></yn-tree>
  </div>
</template>
<script>
export default {
  name: "YnTreePage",
  data() {
    return {
      data: [{
        label: 'Level one 1',
        children: [{
          label: 'Level two 1-1',
          children: [{
            label: 'Level three 1-1-1'
          }]
        }]
      }, {
        label: 'Level one 2',
        children: [{
          label: 'Level two 2-1',
          children: [{
            label: 'Level three 2-1-1'
          }]
        }, {
          label: 'Level two 2-2',
          children: [{
            label: 'Level three 2-2-1'
          }]
        }]
      }, {
        label: 'Level one 3',
        children: [{
          label: 'Level two 3-1',
          children: [{
            label: 'Level three 3-1-1'
          }]
        }, {
          label: 'Level two 3-2',
          children: [{
            label: 'Level three 3-2-1'
          }]
        }]
      }]
    };
  },
  methods: {
    handlePicked(selected) {
      console.log("已选择的是", selected);
    }
  },
};
</script>
<style type="text/css">

</style>
