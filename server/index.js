const app = require('./entities/app')
const http = require('http')

const server = http.createServer(app)

server.listen(process.env.APP_PORT, () => {
  console.info(`App listening on port ${process.env.APP_PORT}`)
})

module.exports = server
