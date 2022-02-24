const publicPath = process.env.NODE_ENV === 'production' ? "/mars/" : "/local/";
module.exports = {
  publicPath,
  outputDir: "docs",
  css: {
    extract: false
  },
  pages: {
    index: {
      entry: "examples/main.js",
      template: "examples/example.html",
      filename: "index.html",
      title: "Examples for one-ui components"
    }
  }
}