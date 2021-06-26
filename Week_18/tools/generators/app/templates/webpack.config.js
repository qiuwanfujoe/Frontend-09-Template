


const { VueLoaderPlugin } = require('vue-loader')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry:'./src/main.js',
    module: {
      rules: [
          {
            test: /\.vue$/,
            use:'vue-loader'
          },
          {
            test: /\.js$/,
            use:{
              loader:'babel-loader',
              options:{
                presets:['@babel/preset-env']
              }
            }
          },
        {
          test: /\.css$/,
          use: [
              'vue-style-loader',
              'css-loader'
          ]
        }
      ]
    },
    plugins: [
        // 请确保引入这个插件！
        new VueLoaderPlugin(),
        new CopyPlugin({
            patterns: [
              { from: "src/*.html", to: "[name].[ext]" },
            ],
          }),
      ]
  };
  