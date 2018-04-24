'use strict';
// requires
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

// plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// config
const common = require('./webpack.common.js');
const distRoot = path.resolve(__dirname, './dist');

module.exports = merge(common.config, {
  module: {
    rules: [{
      test: /\.(styl|stylus)$/,
      use: [MiniCssExtractPlugin.loader].concat(common.utils.styleLoaders({sourceMap: false}))
    }]
  },

  devtool: 'none',

  output: {
    path: distRoot,
    filename: common.utils.staticAsset('js/[name].[chunkhash].js'),
    chunkFilename: common.utils.staticAsset('js/[id].[chunkhash].js')
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {'NODE_ENV': JSON.stringify('development')}
    }),
    // clean dist dir
    new CleanWebpackPlugin(distRoot),

    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: false,
      parallel: true
    }),
    // minify css
    new CssoWebpackPlugin(),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: common.utils.staticAsset('css/[name].[chunkhash].css'),
      chunkFilename: common.utils.staticAsset('css/[id].[chunkhash].css'),
    }),

    new HtmlWebpackPlugin(Object.assign({}, common.utils.htmlWebpackPluginConfig, {
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    })),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks (module) {
    //     // any required modules inside node_modules are extracted to vendor
    //     return (
    //       module.resource &&
    //       /\.js$/.test(module.resource) &&
    //       module.resource.indexOf(
    //         path.join(__dirname, '../node_modules')
    //       ) === 0
    //     )
    //   }
    // }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   minChunks: Infinity
    // }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'app',
    //   async: 'vendor-async',
    //   children: true,
    //   minChunks: 3
    // }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './src/static'),
        to: 'static',
        ignore: ['.*']
      },
      // {
      //   from: path.resolve(__dirname, './src/favicons'),
      //   to: distRoot,
      // },
      // {
      //   from: path.resolve(__dirname, './src/sitemap.xml'),
      //   to: distRoot,
      // },
      // {
      //   from: path.resolve(__dirname, './src/_redirects'),
      //   to: distRoot,
      // },
    ]),

    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    }),

  ]
});
