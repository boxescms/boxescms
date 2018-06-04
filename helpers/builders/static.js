const base = process.cwd()
const {promisify} = require('util')
const {join} = require('path')
const chalk = require('chalk')
const ncp = promisify(require('ncp').ncp)

module.exports = async () => {
  const time = Date.now()

  try {
    await ncp(join(base, 'web/static'), join(base, 'public/static'))

    console.log(`Processed ${chalk.yellow('Statics')} ${chalk.blue('[' + (Date.now() - time) + 'ms]')}`)
  } catch (err) {
    console.log(chalk.grey('Skipping Static - No files to compile'))
  }
}
