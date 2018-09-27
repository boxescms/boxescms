#!/usr/bin/env node

require('dotenv').config()
const program = require('commander')
const chalk = require('chalk')
const { log } = console

let env = process.env.NODE_ENV

program
  .option('--inspect [port=9229]', 'Enable inspect mode, defaults to port 9229')
  .arguments('[environment]')
  .action(environment => {
    env = environment
  })
  .parse(process.argv)

;(async () => {
  if (program.inspect) {
    process.env.BOXES_INSPECTPORT = program.inspect === true ? 9229 : program.inspect
  }

  if (env === 'dev' || env === 'development') {
    log()
    log(chalk.grey('Development Mode, starting watcher instances'))
    log()

    return require('../helpers/watch')
  }

  await require('../')

  await require('../admin')
})()
