const path = require('path')

let appPackage

try {
  appPackage = require(path.resolve(process.cwd(), 'package.json'))
} catch (err) {
  throw new Error(`Error opening App package.json at ${process.cwd()}.`)
}

if (appPackage.name === 'boxescms') {
  throw new Error(`This seems to be the boxescms package folder.`)
}

module.exports = appPackage
