'use strict';
// requires
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const notifier = require('node-notifier');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

// config
const packageJson = require('./package.json');
const common = require('./webpack.common.js');
const port = 8080;
const devHtmlWebpackPluginsConfig = {
  minify: false
};

// generate HtmlWebpackPlugins
const htmlWebpackPlugins = [];
common.utils.htmlWebpackPluginConfig.forEach(function(config) {
  htmlWebpackPlugins.push(new HtmlWebpackPlugin(
    Object.assign({}, config, devHtmlWebpackPluginsConfig)
  ));
});

module.exports = merge(common.config, {
  module: {
    rules: [{
      test: /\.(styl|stylus)$/,
      use: ['style-loader'].concat(common.utils.cssLoaders({sourceMap: false})).concat(common.utils.stylusLoaders({sourceMap: false})),
    }, {
      test: /\.css$/,
      use: ['style-loader'].concat(common.utils.cssLoaders({sourceMap: false})),
    }]
  },
  // cheap-module-eval-source-map is faster for development
  devtool: 'source-map',

  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: 'localhost',
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    publicPath: '/',
    proxy: {},
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    }
  },

  plugins: [

    new webpack.DefinePlugin({
      'process.env': {'NODE_ENV': JSON.stringify('development')}
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),

    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running at port ${port}`],
      },
      onErrors: (severity, errors) => {
        if (severity !== 'error') return;

        const error = errors[0];
        const filename = error.file && error.file.split('!').pop();

        notifier.notify({
          title: packageJson.name,
          message: severity + ': ' + error.name,
          subtitle: filename || '',
          icon: path.join(__dirname, '_errorLogo.png'),
        });
      }
    })

  ].concat(htmlWebpackPlugins)

});
