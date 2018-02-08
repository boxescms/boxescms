require('./helpers/checkIsProjectFolder')
require('dotenv').config()

const fs = require('fs')
const path = require('path')
const http = require('http')

const app = require('./entities/app')
const userApp = path.join(process.cwd(), 'app.js')

module.exports = (async () => {
  if (fs.existsSync(userApp)) {
    await Promise.resolve(require(userApp)(app))
  }

  const server = http.createServer(app)

  await new Promise(resolve => server.listen(process.env.APP_PORT, resolve))

  console.info(`App listening on port ${process.env.APP_PORT}`)

  return server
})()
