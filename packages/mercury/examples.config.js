/*
* @Author: Just be free
* @Date:   2021-09-24 14:37:01
* @Last Modified by:   Just be free
* @Last Modified time: 2021-09-24 18:16:00
* @E-mail: justbefree@126.com
*/
process.env.VUE_APP_VERSION = require('./package.json').version;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const publicPath = process.env.NODE_ENV === 'production' ? "/mercury/" : "/local/";
module.exports = {
  publicPath,
  outputDir: "docs",
  configureWebpack: {
    devtool: "source-map",
    plugins: [
      new MiniCssExtractPlugin({
        filename: `css/[name].css`
      })
    ],
    performance: {
      hints: false
    }
  },
  css: {
    extract: false
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');
    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    // https://cli.vuejs.org/zh/guide/webpack.html#%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%96%B0%E7%9A%84-loader
    svgRule.uses.clear();
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
        .use('url-loader')
          .loader('url-loader')
          .tap(options => Object.assign(options, { limit: 10240 }))
  },
  pages: {
    index: {
      entry: "examples/main.js",
      template: "examples/example.html",
      filename: "index.html",
      title: "Examples for @dullar/mercury components"
    }
  }
};
