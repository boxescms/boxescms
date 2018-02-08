const js = require('./builders/js')
const pug = require('./builders/pug')
const sass = require('./builders/sass')
const image = require('./builders/image')

module.exports = async () => {
  await Promise.all([js(), sass(), image()])

  await pug()
}
