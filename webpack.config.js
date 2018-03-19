require('dotenv').config()

const path = require('path')
const autoprefixer = require('autoprefixer')
const {browserslist} = require('./package.json')
const Dotenv = require('dotenv-webpack')
const base = process.cwd()

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(base, 'public/js'),
    publicPath: process.env.WEB_BASE + '/js/'
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
              browsers: browserslist
            }]
          ]
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
      path: path.join(base, '.env')
    })
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
  }
}
