const base = process.cwd()
const chokidar = require('chokidar')
const builder = require('../builders/sass')
const chalk = require('chalk')

module.exports = () => {
  console.log(chalk.blue('Watching SASS ') + chalk.yellow('[web/sass/**/*.sass]'))

  const watcher = chokidar.watch([
    'web/**/*.sass'
  ], {
    cwd: base
  })

  watcher.on('change', () => builder())

  return watcher
}
