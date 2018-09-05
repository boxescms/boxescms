const base = process.cwd()
const chokidar = require('chokidar')
const builder = require('../builders/pug')
const chalk = require('chalk')

module.exports = async () => {
  console.log(chalk.blue('Watching PUG ') + chalk.yellow('[web/pug/**/*.pug, data @ data/**/*.{js,yml}]'))

  await builder()

  const watcher = chokidar.watch([
    'web/**/*.pug',
    'data/**/*.{js,yml}'
  ], {
    cwd: base
  })

  watcher.on('change', () => builder())

  return watcher
}
