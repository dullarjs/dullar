<template>
  <div>
    <h2>yn-image</h2>
    <div class="image-box">
      <yn-image
        :width="200"
        :height="200"
        fit="cover"
        src="https://mallhubimg.yuanian.com/1eedae7edf78e04cad34f824c656e10d/n12/jfs/t1/153578/1/14562/62999/5fffb53fE3e9cebf4/72eefbaadb48755a.jpg"
      ></yn-image>
      <yn-image
        width="200"
        height="200"
        fit="cover"
        src="https://mallhubimg.yuanian.com/1eedae7edf78e04cad34f824c656e10d/n12/jfs/t1/153578/1/14562/62999/5fffb53fE3e9cebf4/72eefbaadb48755a.jpg"
      >
        <span slot="placeholder">加载中...</span>
      </yn-image>
      <yn-image width="300" fit="cover" :src="imageUrl">
        <span slot="error">怎么就加载失败了呀</span>
      </yn-image>
    </div>
    <div id="imglist-box">
      <yn-image v-for="(img, i) in urls" :key="i" lazy :src="img" alt="" />
    </div>
    <yn-image
      width="200"
      height="200"
      fit="cover"
      lazy
      src="https://image.51ykb.com/3f98559e-fb70-4338-851c-363053fbc2af"
    >
      <span slot="placeholder">加载中...</span>
    </yn-image>
  </div>
</template>
<script>
export default {
  name: "YnImagePage",
  data() {
    return {
      urls: [
        "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
        "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
        "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
        "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
        "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
        "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
        "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg",
      ],
      imageUrl: "",
    };
  },
};
</script>
<style>
.image-box {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 200px;
}
#imglist-box {
  height: 600px;
  overflow: auto;
}
</style>
