require('dotenv').config()

const path = require('path')
const autoprefixer = require('autoprefixer')
const { browserslist } = require('./package.json')
const Dotenv = require('dotenv-webpack')
const base = process.cwd()
const webpack = require('webpack')
const crypto = require('crypto')
const fs = require('fs')
const webpackMerge = require('webpack-merge')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const userPackageFilePath = path.join(base, 'package.json')
const hasUserPackageFile = fs.existsSync(userPackageFilePath)
const userPackageData = hasUserPackageFile ? require(userPackageFilePath) : {}

const userWebpackMergeFilePath = path.join(base, 'webpack.merge.js')
const hasUserWebpackMergeFilePath = fs.existsSync(userWebpackMergeFilePath)

const BUILDHASH = crypto.createHash('sha256')
  .update(Date.now().toString() + Math.random().toString())
  .digest('hex')

const coreWebpackConfig = {
  mode: process.env.NODE_ENV || 'development',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js?[hash]',
    path: path.resolve(base, 'public/js'),
    publicPath: process.env.WEB_BASE + '/js/',
    jsonpFunction: 'webpack' + Date.now().toString()
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [
          path.resolve(base, 'web')
        ],
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: {
                browsers: browserslist
              }
            }]
          ],
          plugins: [
            'lodash',
            ['@babel/plugin-proposal-decorators', {
              legacy: false
            }],
            '@babel/plugin-syntax-dynamic-import',
            ['@babel/plugin-proposal-class-properties', {
              loose: false
            }]
          ]
        }
      },
      {
        test: /\.pug$/,
        oneOf: [
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader']
          },
          {
            use: ['raw-loader', 'pug-plain-loader']
          }
        ]
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader?url=false',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                autoprefixer()
              ]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              indentedSyntax: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader?url=false',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                autoprefixer()
              ]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.vue?$/,
        include: [
          path.resolve(base, 'web')
        ],
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new Dotenv({
      path: path.join(base, '.env')
    }),
    new webpack.EnvironmentPlugin({
      VERSION: process.env.VERSION || userPackageData.version,
      BUILD_HASH: process.env.BUILD_HASH || BUILDHASH
    }),
    new VueLoaderPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  resolve: {
    alias: {
      vue$: path.resolve(base, 'node_modules/vue/dist/vue.esm.js'),
      router$: path.resolve(base, 'node_modules/vue-router/dist/vue-router.esm.js')
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendor'
    }
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-cheap-source-map'
}

module.exports = hasUserWebpackMergeFilePath ? webpackMerge.smart(coreWebpackConfig, require(userWebpackMergeFilePath)) : coreWebpackConfig
