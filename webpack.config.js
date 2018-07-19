require('dotenv').config()

const path = require('path')
const autoprefixer = require('autoprefixer')
const {browserslist} = require('./package.json')
const Dotenv = require('dotenv-webpack')
const base = process.cwd()
const webpack = require('webpack')
const crypto = require('crypto')
const fs = require('fs')

const userPackageFilePath = path.join(base, 'package.json')
const hasUserPackageFile = fs.existsSync(userPackageFilePath)
const userPackageData = hasUserPackageFile ? require(userPackageFilePath) : {}

const BUILDHASH = crypto.createHash('sha256')
  .update(Date.now().toString() + Math.random().toString())
  .digest('hex')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  output: {
    filename: '[name].js',
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
            ['env', {
              targets: {
                browsers: browserslist
              }
            }],
            'stage-2'
          ],
          plugins: ['lodash']
        }
      },
      {
        test: /\.vue?$/,
        include: [
          path.resolve(base, 'web')
        ],
        loader: 'vue-loader',
        options: {
          loaders: {
            js: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['env', {
                    targets: {
                      browsers: browserslist
                    }
                  }],
                  'stage-2'
                ]
              },
              plugins: ['lodash']
            },
            sass: {
              loader: 'style-loader!css-loader?url=false!sass-loader?indentedSyntax=true'
            }
          },
          postcss: [autoprefixer()]
        }
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
  devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-eval-source-map'
}
