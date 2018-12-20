#!/usr/bin/env node

require('dotenv').config()

const program = require('commander')
const glob = require('glob')
const chalk = require('chalk')
const { basename, resolve, join } = require('path')
const allowedTypes = glob.sync(resolve(__dirname, '../helpers/builders/*.js')).map(item => basename(item, '.js'))

const fs = require('fs')
const base = process.cwd()

const userPackageFilePath = join(base, 'package.json')

if (fs.existsSync(userPackageFilePath) && process.env.VERSION === undefined) {
  const userPackageData = require(userPackageFilePath)

  process.env.VERSION = userPackageData.version
}

let inputtypes

program
  .arguments('<types...>')
  .action(types => {
    inputtypes = types
  })
  .parse(process.argv)

;(async () => {
  if (!inputtypes) {
    return require('../helpers/build')
  }

  for (let i = 0; i < inputtypes.length; i++) {
    const type = inputtypes[i]

    if (!allowedTypes.includes(type)) {
      console.error(chalk.red(`${type} is not supported.`))
      continue
    }

    await require(`../helpers/builders/${type}`)()
  }
})()
