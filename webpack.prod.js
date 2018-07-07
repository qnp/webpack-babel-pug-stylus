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
const prodHtmlWebpackPluginsConfig = {
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true
  },
  // necessary to consistently work with multiple chunks via CommonsChunkPlugin
  chunksSortMode: 'dependency'
};

// generate HtmlWebpackPlugins
const htmlWebpackPlugins = [];
common.utils.htmlWebpackPluginConfig.forEach(function(config) {
  htmlWebpackPlugins.push(new HtmlWebpackPlugin(
    Object.assign({}, config, prodHtmlWebpackPluginsConfig)
  ));
});

module.exports = merge(common.config, {
  module: {
    rules: [{
      test: /\.(styl|stylus)$/,
      use: [MiniCssExtractPlugin.loader].concat(common.utils.cssLoaders({sourceMap: false})).concat(common.utils.stylusLoaders({sourceMap: false}))
    }, {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader].concat(common.utils.cssLoaders({sourceMap: false}))
    }]
  },

  devtool: 'none',

  output: {
    path: distRoot,
    filename: common.utils.staticAsset('js/[name].[hash].js'),
    chunkFilename: common.utils.staticAsset('js/[id].[name].[hash].js'),
    hashDigestLength: 5,
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
      filename: common.utils.staticAsset('css/[name].[hash].css'),
      chunkFilename: common.utils.staticAsset('css/[id].[name].[hash].css'),
    }),

    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),

    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: 'static',
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, './src/favicons'),
        to: distRoot,
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, './src/root'),
        to: distRoot,
        ignore: ['.*']
      },
    ]),

    new BundleAnalyzerPlugin({
      reportFilename: '../report/report.html',
      analyzerMode: 'static',
      openAnalyzer: false
    }),

  ].concat(htmlWebpackPlugins)

});
