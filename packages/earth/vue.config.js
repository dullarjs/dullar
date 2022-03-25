/*
* @Author: Just be free
* @Date:   2020-05-06 14:45:16
* @Last Modified by:   Just be free
* @Last Modified time: 2022-03-25 10:08:58
* @E-mail: justbefree@126.com
*/
process.env.VUE_APP_VERSION = require('./package.json').version;
const { defineConfig } = require('@vue/cli-service');
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const publicPath = process.env.NODE_ENV === 'production' ? "/earth/" : "/local/";
// const publicPath = (process.env.npm_lifecycle_event === "build:prod") ? "https://pkg.51ykb.com" : "https://testpkg.51ykb.com";
const mfePlugin = () => {
  if (["build", "build", "serve"].includes(process.env.npm_lifecycle_event)) {
    return [new ModuleFederationPlugin({
      // runtime: "dullarjs-runtime",
      runtime: false,
      name: "dullarjs",
      // library: { type: "umd", name: "flight" },
      // library: { type: "umd" },
      filename: "remoteEntry.js",
      exposes: {
        "./earth": "./lib/@dullar/earth.umd.min"
      },
      remotes: {
        // hotel: "hotel@http://localhost:8082/remoteEntry.js",
        // train: "train@http://localhost:8083/remoteEntry.js",
      },
      shared: ["vue", "vue-router", "core-js"]
    })];
  } else {
    return [
      new MiniCssExtractPlugin({
        filename: `css/[name].css`
      })
    ];
  }
}

module.exports = defineConfig({
  publicPath,
  outputDir: "docs",
  transpileDependencies: true,
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
    devtool: "source-map",
    plugins: mfePlugin(),
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
    }
  },
  css: {
    extract: false
  },
  pages: {
    index: {
      entry: "examples/main.js",
      template: "examples/example.html",
      filename: "index.html",
      title: "Examples for @dullar/earth components"
    }
  },
  devServer: {
    port: 8080
  }
});
