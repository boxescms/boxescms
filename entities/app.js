const express = require('express')
const app = express()

app.use(require('compression')())

app.use('/', require('../app/api'))
app.use('/', require('../app/routes'))

app.use((err, req, res, next) => {
  // TODO: Show error page
  res.status(404)
  res.write(err.message)
  res.end()
})

module.exports = app
