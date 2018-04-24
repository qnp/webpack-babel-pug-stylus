'use strict';
// requires
const path = require('path');

// utils

function resolve(_path) {
  return path.resolve(__dirname, './', _path);
}

function staticAsset(_path) {
  return path.posix.join('static', _path);
}

// config
// const metas = require('./src/metas.js');

module.exports = {
  utils: {
    staticAsset: staticAsset,
    styleLoaders: function(options) {
      return [
        {
          loader: 'css-loader',
          options: options
        }, {
          loader: 'postcss-loader',
          options: options
        }, {
          loader: 'stylus-loader',
          options: options
        }
      ];
    },
    htmlWebpackPluginConfig: {
      filename: 'index.html',
      template: path.resolve(__dirname, './src/views/index.pug'),
      // meta: metas,
      inject: true,
    }
  },
  config: {
    context: resolve('.'),
    entry: {
      index: './src/entries/index.js'
    },
    output: {
      path: resolve('dist'),
      filename: '[name].js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        '@': resolve('src'),
      }
    },
    resolveLoader: {
      modules: ['node_modules']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          include: [resolve('src')],
          options: {
            formatter: require('eslint-friendly-formatter'),
            emitWarning: true
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolve('src')]
        },
        {
          test: /\.pug$/,
          loader: 'pug-loader',
          options: {
            pretty: true
          }
        },
        {
          test: /\.svg$/,
          use: [{
            loader: 'svg-inline-loader',
            options: {
              removeTags: false,
              removingTagAttrs: ['xmlns:xlink', 'xmlns', 'id', 'version', 'x', 'y']
            }
          }, {
            loader: 'svgo-loader'
          }]
        },
        {
          test: /\.(png|jpe?g|gif)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: staticAsset('img/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: staticAsset('media/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: staticAsset('fonts/[name].[hash:7].[ext]')
          }
        }
      ]
    },
    node: {
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
  }
};
