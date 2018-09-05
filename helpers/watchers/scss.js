const base = process.cwd()
const chokidar = require('chokidar')
const builder = require('../builders/scss')
const chalk = require('chalk')

module.exports = async () => {
  console.log(chalk.blue('Watching SCSS ') + chalk.yellow('[web/scss/**/*.scss]'))

  await builder()

  const watcher = chokidar.watch([
    'web/**/*.scss'
  ], {
    cwd: base
  })

  watcher.on('change', () => builder())

  return watcher
}
