const base = process.cwd()
const {promisify} = require('util')
const {join} = require('path')
const chalk = require('chalk')
const ncp = promisify(require('ncp').ncp)

module.exports = async () => {
  try {
    await ncp(join(base, 'web/static'), join(base, 'public/static'))

    console.log(`${chalk.yellow('Static')} last processed at ${chalk.blue('[' + (new Date()) + ']')}`)
  } catch (err) {
    console.log(chalk.grey('Skipping Static - No files to compile'))
  }
}
