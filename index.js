require('dotenv').config()

const base = process.cwd()
const chalk = require('chalk')
const fs = require('fs')
const {join} = require('path')
const http = require('http')
const {log} = console
const getPort = require('get-port')

const app = require('./entities/app')
const userApp = join(base, 'app.js')
const {name, version} = require(join(base, 'package.json'))

log()
log(chalk.blue(name) + ' ' + chalk.yellow(`[v${version}]`))
log(chalk.blue(new Array(name.length + version.toString().length + 4).fill('-').join('')))
log()

module.exports = (async () => {
  if (fs.existsSync(userApp)) {
    await Promise.resolve(require(userApp)(app))
  }

  if (!process.env.APP_PORT) {
    process.env.APP_PORT = await getPort()
    log(chalk.red(`APP_PORT not defined. Using port ${process.env.APP_PORT}.`))
  }

  const server = http.createServer(app)

  await new Promise(resolve => server.listen(process.env.APP_PORT, resolve))

  log()
  log(`App listening on port ${chalk.blue(process.env.APP_PORT)}`)

  return server
})()
