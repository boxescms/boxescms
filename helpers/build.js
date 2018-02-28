const js = require('./builders/js')
const pug = require('./builders/pug')
const sass = require('./builders/sass')
const scss = require('./builders/scss')
const image = require('./builders/image')

module.exports = (async () => {
  await js()
  await sass()
  await scss()
  await image()
  await pug()
})()
