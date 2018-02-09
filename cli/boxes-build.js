#!/usr/bin/env node

const program = require('commander')
const glob = require('glob')
const chalk = require('chalk')
const {basename, resolve} = require('path')
const allowedTypes = glob.sync(resolve(__dirname, '../helpers/builders/*.js')).map(item => basename(item, '.js'))

let inputtypes

program
  .arguments('<types...>')
  .action(async types => {
    inputtypes = types
  })
  .parse(process.argv)

;(async () => {
  if (!inputtypes) {
    return require('../helpers/buildWeb')()
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
