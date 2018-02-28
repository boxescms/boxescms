const base = process.cwd()
const chokidar = require('chokidar')
const builder = require('../builders/js')
const chalk = require('chalk')

module.exports = () => {
  console.log(chalk.blue('Watching JS ') + chalk.yellow('[web/{js,vue}/**/*.{js,vue}]'))

  const watcher = chokidar.watch([
    'web/js/**/*.js',
    'web/vue/**/*.vue'
  ], {
    cwd: base
  })

  watcher.on('change', () => builder())

  return watcher
}