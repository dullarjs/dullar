<template>
  <div class="tree-box">
    <h2>yn-tree</h2>
    <div>
      <p>default</p>
      <yn-tree :data="data" @pick="handlePicked"></yn-tree>
    </div>
    <div>
      <p>checkbox</p>
      <yn-tree :data="data2" showCheckbox @pick="handlePicked"></yn-tree>
    </div>
    <div>
      <p>lazy</p>
      <yn-tree :data="data3" :load="load()" lazy showCheckbox @pick="handlePicked"></yn-tree>
    </div>
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
      }],
      data2: [{
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
      }],
      data3: [{
        label: 'Level one 1'
      }, {
        label: 'Level one 2'
      }, {
        label: 'Level one 3'
      }]
    };
  },
  methods: {
    handlePicked(selected) {
      console.log("已选择的是", selected);
    },
    requestLoad(args) {
      const { node } = args;
      console.log("接收到的参数", node);
      return new Promise((resolve, reject) => {
        console.log(reject);
        const result = [];
        [1, 2, 3, 4, 5].forEach(i => {
          result.push({ label: `Level ${node.id}-${i}` });
        });
        setTimeout(() => {
          resolve(result);
        }, 1000);
      }).catch(err => {
        console.log("失败", err);
      });
    },
    load() {
      return {
        params: { a: 1, b: 2, c: 3 },
        action: this.requestLoad
      }
    }
  },
};
</script>
<style type="text/css">

</style>
