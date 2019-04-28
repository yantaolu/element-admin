'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: false,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: false,
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(process.cwd(), './lib'),
    filename: 'element-admin.js',
    chunkFilename: '[id].js',
    libraryTarget: 'umd'
  },
  externals: {
    vue: 'vue',
    'element-ui': 'element-ui'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.build.env
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: false,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/element-admin.css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? {safe: true, map: {inline: false}}
        : {safe: true}
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/css'),
        to: path.resolve(__dirname, '../lib/css')
      }, {
        from: path.resolve(__dirname, '../node_modules/element-ui/lib/locale'),
        to: path.resolve(__dirname, '../lib/locale')
      }, {
        from: path.resolve(__dirname, '../node_modules/font-awesome/css'),
        to: path.resolve(__dirname, '../lib/css')
      }, {
        from: path.resolve(__dirname, '../node_modules/font-awesome/fonts'),
        to: path.resolve(__dirname, '../lib/fonts')
      }
    ])
  ]
})


module.exports = webpackConfig
