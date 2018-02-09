const js = require('./builders/js')
const pug = require('./builders/pug')
const sass = require('./builders/sass')
const image = require('./builders/image')

module.exports = async () => {
  let time = Date.now()

  await js()

  console.log(`Compiled JS: ${Date.now() - time}ms`)
  time = Date.now()

  await sass()

  console.log(`Compiled SASS: ${Date.now() - time}ms`)
  time = Date.now()

  await image()

  console.log(`Compiled Images: ${Date.now() - time}ms`)
  time = Date.now()

  await pug()

  console.log(`Compiled Pug: ${Date.now() - time}ms`)
}
