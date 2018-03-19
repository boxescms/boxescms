const base = process.cwd()
const {promisify} = require('util')
const {relative, join, dirname} = require('path')
const glob = promisify(require('glob'))
const chalk = require('chalk')
const fs = require('fs')
const mkdirp = promisify(require('mkdirp'))
const copyFile = promisify(fs.copyFile)

module.exports = async () => {
  const time = Date.now()

  const files = await glob(join(base, 'web/static/**/*'))

  if (!files.length) {
    console.log(chalk.grey('Skipping Statics - No files to process'))
    return
  }

  await Promise.all(files.map(async file => {
    const relativepath = relative(join(base, 'web/static'), file)
    const target = join(base, 'public/static', relativepath)
    const dir = dirname(target)

    try {
      await mkdirp(dir)
      await copyFile(file, join(base, 'public/static', relativepath))
    } catch (err) {
      console.log(chalk.red(err.message))
    }
  }))

  console.log(`Processed ${chalk.yellow('Statics')} ${chalk.blue('[' + (Date.now() - time) + 'ms]')}`)
}
