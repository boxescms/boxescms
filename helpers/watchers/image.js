const base = process.cwd()
const chokidar = require('chokidar')
const builder = require('../builders/image')
const chalk = require('chalk')

module.exports = async () => {
  console.log(chalk.blue('Watching Images ') + chalk.yellow('[web/**/*.{png,jpg,svg,gif,mp4}]'))

  await builder()

  const watcher = chokidar.watch([
    'web/**/*.{png,jpg,svg,gif,mp4}'
  ], {
    cwd: base
  })

  watcher.on('change', () => builder())

  return watcher
}
