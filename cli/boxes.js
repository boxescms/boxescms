#!/usr/bin/env node

const appPackage = require('../helpers/checkIsProjectFolder')
const appversion = appPackage.version
const program = require('commander')
const {version} = require('../package.json')

program
  .version(`APP: ${appversion}, CMS: ${version}`)
  .command('init', 'Initialise')
  .command('generateAppKey', 'Generate app key')
  .command('build', 'Build static pages and assets')
  .command('watch', 'Watch and build file changes for development')
  .command('admin', 'Create an admin user')
  .command('start', 'Start app server')
  .parse(process.argv)
