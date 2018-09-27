const express = require('express')
const app = express()
const { resolve } = require('path')

app.use(require('compression')())

app.use('/', require('../api'))

app.use('/', express.static(resolve(__dirname, '../public'), {
  extensions: ['html']
}))

app.use((err, req, res, next) => {
  // TODO: Show error page
  res.status(404)
  res.write(err.message)
  res.end()
})

module.exports = app
