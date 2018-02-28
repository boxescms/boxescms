require('dotenv').config()

const chalk = require('chalk')
const http = require('http')
const {log} = console

const app = require('./entities/admin')

module.exports = (async () => {
  if (!process.env.ADMIN_PORT) {
    return log(chalk.red('ADMIN_PORT must be defined to start a server.'))
  }

  const server = http.createServer(app)

  await new Promise(resolve => server.listen(process.env.ADMIN_PORT, resolve))

  log()
  log(`Admin listening on port ${chalk.blue(process.env.ADMIN_PORT)}`)

  return server
})()
