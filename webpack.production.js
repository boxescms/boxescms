const merge = require('webpack-merge')
const UglifyjsPlugin = require('uglifyjs-webpack-plugin')
const config = require('./webpack.config.js')

module.exports = merge(config, {
  plugins: [
    new UglifyjsPlugin()
  ]
})
