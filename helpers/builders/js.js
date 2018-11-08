const base = process.cwd()
const { join, resolve, relative } = require('path')
const { promisify } = require('util')
const fs = require('fs')
const glob = promisify(require('glob'))
const mkdirp = promisify(require('mkdirp'))
const webpack = require('webpack')
const chalk = require('chalk')

const userWebpackFile = join(base, 'webpack.config.js')
const hasUserWebpackFile = fs.existsSync(userWebpackFile)

const webpackFile = hasUserWebpackFile ? userWebpackFile : resolve(__dirname, '../../webpack.config.js')

const webpackConfig = require(webpackFile)

const userWebpackES6File = join(base, 'webpack.config.js')
const hasUserWebpackES6File = fs.existsSync(userWebpackES6File)

const webpackES6File = hasUserWebpackES6File ? userWebpackES6File : resolve(__dirname, '../../webpack.config.es6.js')

const webpackES6Config = require(webpackES6File)

const basejspath = join(base, 'web/js')

let webpackInstance
let webpackES6Instance

const logStats = stats => {
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
}

const builder = async (watch = false) => {
  const time = Date.now()

  if (!webpackInstance) {
    const files = await glob(join(basejspath, '**/*.js'))

    if (!files.length) {
      console.log(chalk.grey('Skipping JS - No files to compile'))
      return
    }

    const entry = files.reduce((entries, file) => {
      const filename = relative(basejspath, file).slice(0, -3)

      entries[filename] = file

      return entries
    }, {})

    webpackConfig.entry = entry
    webpackES6Config.entry = entry

    await mkdirp(join(base, 'public', 'js'))

    webpackInstance = webpack(webpackConfig)
    webpackES6Instance = webpack(webpackES6Config)
  }

  if (watch) {
    webpackInstance.watch({
      ignored: ['node_modules', 'api/**', 'storage/**', 'public/**', 'server/**']
    }, (err, stats) => {
      if (err) {
        console.error(err)
        return
      }

      const info = stats.toJson()

      let hasErrors = false

      if (stats.hasErrors()) {
        info.errors.map(err => console.error(err))
        hasErrors = true
      }

      if (stats.hasWarnings()) {
        info.warnings.map(err => console.warn(err))
        hasErrors = true
      }

      if (hasErrors) {
        return
      }

      console.log(`${chalk.yellow('JS')} last compiled at ${chalk.blue('[' + (new Date()) + ']')}`)
    })

    webpackES6Instance.watch({
      ignored: ['node_modules', 'api/**', 'storage/**', 'public/**', 'server/**']
    }, (err, stats) => {
      if (err) {
        console.error(err)
        return
      }

      const info = stats.toJson()

      let hasErrors = false

      if (stats.hasErrors()) {
        info.errors.map(err => console.error(err))
        hasErrors = true
      }

      if (stats.hasWarnings()) {
        info.warnings.map(err => console.warn(err))
        hasErrors = true
      }

      if (hasErrors) {
        return
      }

      console.log(`${chalk.yellow('ES6')} last compiled at ${chalk.blue('[' + (new Date()) + ']')}`)
    })

    return
  }

  try {
    const [stats, statsES6] = await Promise.all([
      new Promise((resolve, reject) => {
        webpackInstance.run((err, res) => {
          if (err) {
            return reject(err)
          }

          resolve(res)
        })
      }),
      new Promise((resolve, reject) => {
        webpackES6Instance.run((err, res) => {
          if (err) {
            return reject(err)
          }

          resolve(res)
        })
      })
    ])

    logStats(stats)
    logStats(statsES6)
  } catch (err) {
    console.error(err)
  }

  console.log(`Compiled ${chalk.yellow('JS/ES6')} ${chalk.blue('[' + (Date.now() - time) + 'ms]')}`)
}

module.exports = builder
