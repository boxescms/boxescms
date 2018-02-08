require('dotenv').config()

const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const {browserslist} = require('./package.json')
const Dotenv = require('dotenv-webpack')
const UglifyjsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: process.env.WEB_BASE + '/js/'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, 'web')
        ],
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', {
              browsers: browserslist
            }]
          ]
        }
      },
      {
        test: /\.vue?$/,
        include: [
          path.resolve(__dirname, 'web')
        ],
        loader: 'vue-loader',
        options: {
          loaders: {
            js: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['env', {
                    browsers: browserslist
                  }]
                ]
              }
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
      path: './.env'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new UglifyjsPlugin()
  ],
  resolve: {
    alias: {
      vue$: path.resolve(__dirname, 'node_modules/vue/dist/vue.esm.js'),
      router$: path.resolve(__dirname, 'node_modules/vue-router/dist/vue-router.esm.js')
    }
  }
}
