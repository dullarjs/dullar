/*
* @Author: Just be free
* @Date:   2020-05-06 14:45:16
* @Last Modified by:   Just be free
* @Last Modified time: 2022-03-14 17:30:51
* @E-mail: justbefree@126.com
*/
process.env.VUE_APP_VERSION = require('./package.json').version;
const { defineConfig } = require('@vue/cli-service');
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const publicPath = process.env.NODE_ENV === 'production' ? "/mercury/" : "/local/";
const mfePlugin = () => {
  if (["build", "build", "serve"].includes(process.env.npm_lifecycle_event)) {
    return [new ModuleFederationPlugin({
      name: "dullarjs",
      // library: { type: "umd", name: "flight" },
      // library: { type: "umd" },
      filename: "remoteEntry.js",
      exposes: {
        "./mercury": "./lib/@dullar/mercury.umd.min"
      },
      remotes: {
        // hotel: "hotel@http://localhost:8082/remoteEntry.js",
        // train: "train@http://localhost:8083/remoteEntry.js",
      },
      // shared: require("./package.json").dependencies,
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
  // outputDir: "docs",
  transpileDependencies: true,
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
    devtool: "source-map",
    plugins: mfePlugin()
  },
  css: {
    extract: false
  },

  pages: {
    index: {
      entry: "examples/main.js",
      template: "examples/example.html",
      filename: "index.html",
      title: "Examples for @dullar/mercury components"
    }
  },
  devServer: {
    port: 8080
  }
});
