#!/usr/bin/env node

require('dotenv').config()
const program = require('commander')
const chalk = require('chalk')
const { log } = console

let type

program
  .option('--inspect [port=9229]', 'Enable inspect mode, defaults to port 9229, only works with explicit dev mode')
  .option('--watch', 'Enable watch mode')
  .arguments('[type]', 'Optional, server, web')
  .action(argType => {
    type = argType
  })
  .parse(process.argv)

;(async () => {
  if (program.inspect) {
    process.env.BOXES_INSPECTPORT = program.inspect === true ? 9229 : program.inspect
  }

  if (program.watch) {
    log()
    log(chalk.grey('Watch Mode, starting watcher instances'))
    log()

    if (type === 'server') {
      return require('../helpers/watchers/server')()
    }

    if (type === 'web') {
      require('../helpers/watchers/js')
      require('../helpers/watchers/pug')
      require('../helpers/watchers/sass')
      require('../helpers/watchers/scss')
      require('../helpers/watchers/image')

      return
    }

    return require('../helpers/watch')
  }

  await require('../')
  await require('../admin')
})()
