const base = process.cwd()
const {join, resolve, basename} = require('path')
const {promisify} = require('util')
const fs = require('fs')
const glob = promisify(require('glob'))
const mkdirp = promisify(require('mkdirp'))
const webpack = require('webpack')
const chalk = require('chalk')

const userWebpackFile = join(base, 'webpack.config.js')
const hasUserWebpackFile = fs.existsSync(userWebpackFile)

const webpackFile = hasUserWebpackFile ? userWebpackFile : resolve(__dirname, '../../webpack.config.js')

const webpackConfig = require(webpackFile)

const builder = async () => {
  const time = Date.now()

  const files = await glob(join(base, 'web/js/**/*.js'))

  if (!files.length) {
    console.log(chalk.grey('Skipping JS - No files to compile'))
    return
  }

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

  console.log(`Compiled ${chalk.yellow('JS')} ${chalk.blue('[' + (Date.now() - time) + 'ms]')}`)
}

module.exports = builder
