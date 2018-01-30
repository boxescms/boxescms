require('../../helpers/checkIsProjectFolder')

const express = require('express')
const app = express()

app.use('/', require('../api'))
app.use('/', require('../routes'))

app.use((err, req, res, next) => {
  // TODO: Show error page
  res.status(404)
  res.write(err.message)
  res.end()
})

module.exports = app
