const builder = require('../builders/js')
const chalk = require('chalk')

module.exports = () => {
  console.log(chalk.blue('Watching JS ') + chalk.yellow('[web/**/*.{js,vue}]'))

  builder(true)
}
