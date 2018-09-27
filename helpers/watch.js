const glob = require('glob')
const { join, basename } = require('path')

const watchers = glob.sync(join(__dirname, 'watchers/*.js')).reduce((items, file) => {
  items[basename(file, '.js')] = require(file)
  return items
}, {})

module.exports = Object.keys(watchers)
  .reduce((result, type) => {
    result[type] = watchers[type]()
    return result
  }, {})
