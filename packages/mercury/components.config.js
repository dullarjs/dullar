/*
* @Author: Just be free
* @Date:   2021-09-24 14:37:07
* @Last Modified by:   Just be free
* @Last Modified time: 2021-09-26 16:25:39
* @E-mail: justbefree@126.com
*/

const { resolve, getComponentEntries } = require("./build/utils");
module.exports = {
  outputDir: resolve("lib"),
  configureWebpack: {
    entry: {
      ...getComponentEntries("src")
    },
    output: {
      filename: "[name]/index.js",
      libraryTarget: "umd",
      libraryExport: "default",
      library: "@dullar/mercury"
    },
    resolve: {
      extensions: [".js", ".vue", ".json"],
      alias: {
        'src': resolve("src"),
        // 'components': resolve("src"),
        '@dullar/mercury': resolve("src/index.js")
      }
    }
  },
  css: {
    sourceMap: true,
    extract: {
      filename: "[name]/style.css"
    }
  },
  chainWebpack: config => {
    config.optimization.delete('splitChunks')
    config.plugins.delete('copy')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.plugins.delete('html')
    config.plugins.delete('hmr')
    config.entryPoints.delete('app')
    config.optimization.minimize(true);
    config.module
      .rule("fonts")
      .use("url-loader")
      .tap(option => {
        option.fallback.options.name = "static/fonts/[name].[hash:8].[ext]"
        return option;
      })
  }
}
