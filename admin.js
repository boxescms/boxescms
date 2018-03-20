require('dotenv').config()

const chalk = require('chalk')
const http = require('http')
const {log} = console
const getPort = require('get-port')

const app = require('./entities/admin')

module.exports = (async () => {
  if (!process.env.ADMIN_PORT) {
    process.env.ADMIN_PORT = await getPort()

    log(chalk.red(`ADMIN_PORT not defined. Using port ${process.env.ADMIN_PORT}.`))
  }

  const server = http.createServer(app)

  await new Promise(resolve => server.listen(process.env.ADMIN_PORT, resolve))

  log()
  log(`Admin listening on port ${chalk.blue(process.env.ADMIN_PORT)}`)

  return server
})()
