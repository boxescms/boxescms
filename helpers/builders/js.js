const base = process.cwd()
const {join, resolve, basename} = require('path')
const {promisify} = require('util')
const fs = require('fs')
const glob = promisify(require('glob'))
const mkdirp = promisify(require('mkdirp'))
const webpack = require('webpack')

const userWebpackFile = join(base, 'webpack.config.js')
const hasUserWebpackFile = fs.existsSync(userWebpackFile)

const webpackFile = hasUserWebpackFile ? userWebpackFile : resolve(__dirname, '../../webpack.config.js')

const webpackConfig = require(webpackFile)

const builder = async () => {
  const files = await glob(join(base, 'web/js/**/*.js'))

  const entry = files.reduce((entries, file) => {
    const filename = basename(file, '.js')

    entries[filename] = file

    return entries
  }, {})

  webpackConfig.entry = entry

  await mkdirp(join(base, 'public', 'js'))

  try {
    const stats = await promisify(webpack)(webpackConfig)

    const info = stats.toJson()

    if (stats.hasErrors()) {
      info.errors.map(err => console.error(err))
    }

    if (stats.hasWarnings()) {
      info.warnings.map(err => console.warn(err))
    }

    console.log(stats.toString({
      colors: true
    }))
  } catch (err) {
    console.error(err)
  }
}

module.exports = builder
