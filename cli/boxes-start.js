#!/usr/bin/env node

require('dotenv').config()
const program = require('commander')
const chalk = require('chalk')
const {log} = console

let env = process.env.NODE_ENV

program
  .arguments('[environment]')
  .action(environment => {
    env = environment
  })
  .parse(process.argv)

;(async () => {
  if (env === 'dev' || env === 'development') {
    log()
    log(chalk.grey('Development Mode, starting watcher instances'))
    log()

    return require('../helpers/watch.js')()
  }

  await require('../')

  await require('../admin')
})()
