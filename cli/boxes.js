#!/usr/bin/env node

const program = require('commander')
const {version} = require('../package.json')

program
  .version(version)
  .command('init', 'Initialise')
  .command('file [name]', 'File related commands.')
  .command('generate:appkey', 'Generate app key')
  .command('start', 'Start app server')
  .parse(process.argv)
