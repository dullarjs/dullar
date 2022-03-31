const { defineConfig } = require('@vue/cli-service');
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
const publicPath = process.env.NODE_ENV === 'production' ? "/mars/" : "/local/";

const mfePlugin = () => {
  if (["build", "build", "serve"].includes(process.env.npm_lifecycle_event)) {
    return [
      new ModuleFederationPlugin({
            // runtime: "dullarjs-runtime",
        runtime: false,
        name: "dullarjs",
        // library: { type: "umd", name: "flight" },
        // library: { type: "umd" },
        filename: "remoteEntry.js",
        exposes: {
          "./mars": "./lib/@dullar/mars.umd.min"
        },
        remotes: {
          // hotel: "hotel@http://localhost:8082/remoteEntry.js",
          // train: "train@http://localhost:8083/remoteEntry.js",
        },
        shared: ["vue", "vue-router", "core-js"]
      })
    ];
  }
  return [];
}
module.exports = defineConfig({
  publicPath,
  outputDir: "docs",
  transpileDependencies: true,
  css: {
    extract: false
  },
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
    module: {
      rules: [
        {
          test: /\.(svg)(\?.*)?$/,
          type: 'asset',
          parser: {
             dataUrlCondition: {
               maxSize: 20 * 1024 // 20kb
             }
          },
          use: 'svgo-loader'
        }
      ]
    },
    plugins: [
      ...mfePlugin()
    ]
  },
  pages: {
    index: {
      entry: "examples/main.js",
      template: "examples/example.html",
      filename: "index.html",
      title: "Examples for one-ui components"
    }
  }
});