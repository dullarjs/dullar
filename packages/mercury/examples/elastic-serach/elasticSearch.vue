<template>
  <div>
    <h2>yn-elastic-search</h2>
    <yn-elastic-search :history="getHistory()" :delete="deleteHistory()" placeholder="请输入要搜索的商品"></yn-elastic-search>
  </div>
</template>
<script type="text/javascript">
  const data = [{ label: "电饭锅", id: 1 }, { label: "我和我的祖国", id: 2 }, { label: "男短裤", id: 3 }, { label: "夏季专用坐垫橘黄色", id: 4 }];
  export default {
    name: "YnElasticSearchPage",
    data() {
      return {
      };
    },
    methods: {
      getHistoryAction(params) {
        console.log("这里处理请求的参数", params);
        return new Promise((resolve, reject) => {
          console.log(reject);
          // setTimeout(() => {
          //   reject("失败信息");
          // }, 1000);
          setTimeout(() => {
            resolve(data);
          }, 1000);
        }).catch(err => {
          this.Toast(err);
          console.log(err, "异常在组件外面处理");
        });
      },
      getHistory() {
        return {
          params: { a: "1", b: "2", c: "3" },
          action: this.getHistoryAction,
          parse: (e, params) => {
            if (params.type === "request") {
              return e;
            } else if (params.type === "parser") {
              return e.label;
            }
          }
        }
      },
      deleteHistoryAction(params) {
        console.log("这里处理请求的参数", params);
        return new Promise((resolve, reject) => {
          console.log(reject);
          setTimeout(() => {
            resolve([]);
          }, 1000);
        }).catch(err => {
          console.log(err);
        });
      },
      deleteHistory() {
        return {
          params: { a: "1", b: "2", c: "3" },
          action: this.deleteHistoryAction,
          parse: (e, params) => {
            console.log(params);
            return e.length === 0;
          }
        }
      }
    }
  };
</script>

<style type="text/css" scoped="scoped">

</style>
