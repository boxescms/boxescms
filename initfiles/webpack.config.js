require('dotenv').config()

const path = require('path')
const autoprefixer = require('autoprefixer')
const {browserslist} = require('./package.json')
const Dotenv = require('dotenv-webpack')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
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
    })
  ],
  resolve: {
    alias: {
      vue$: path.resolve(__dirname, 'node_modules/vue/dist/vue.esm.js'),
      router$: path.resolve(__dirname, 'node_modules/vue-router/dist/vue-router.esm.js')
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
