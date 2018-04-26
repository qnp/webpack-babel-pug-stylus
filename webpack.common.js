'use strict';
// requires
const path = require('path');
const metas = require('./src/metas/index.js');

/* YOUR DIFFERENT ENTRIES HERE */
const entries = [
  {
    name: 'index',
    metas: metas,
  },
  {
    name: 'page1',
    entryPoint: './src/entries/page1_entry.js',
    viewPoint: './src/views/page1_view.pug',
    outputPoint: 'page1/index.html',
    metas: metas,
  }
];
/* */

// utils
function resolve(_path) {
  return path.resolve(__dirname, './', _path);
}

function staticAsset(_path) {
  return path.posix.join('static', _path);
}

function formatEntries(_entries) {
  const entriesObj = {};
  _entries.forEach(function(entry) {
    entriesObj[entry.name] = entry.entryPoint ? entry.entryPoint : './src/entries/' + entry.name + '.js';
  });
  return entriesObj;
}

function generateHtmlWepackPluginConfig(_entries) {
  const config = [];
  _entries.forEach(function(entry) {
    config.push({
      filename: entry.outputPoint ? entry.outputPoint : entry.name + '.html',
      template: path.resolve(__dirname, entry.viewPoint ? entry.viewPoint : './src/views/' + entry.name + '.pug'),
      chunks: ['runtime', 'commons', entry.name],
      meta: entry.metas,
      inject: true,
    });
  });
  return config;
}

// config
const urlLoaderLimit = 10000;

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
    htmlWebpackPluginConfig: generateHtmlWepackPluginConfig(entries)
  },
  config: {
    context: resolve('.'),
    entry: formatEntries(entries),
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
            limit: urlLoaderLimit,
            name: staticAsset('img/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: urlLoaderLimit,
            name: staticAsset('media/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: urlLoaderLimit,
            name: staticAsset('fonts/[name].[hash:7].[ext]')
          }
        }
      ]
    },
    optimization: {
      runtimeChunk: {
        name: 'runtime'
      },
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2
          }
        }
      }
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
