const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: "examples/main.js",
      template: "examples/example.html",
      filename: "index.html",
      title: "Examples for jupiter components"
    }
  }
})
