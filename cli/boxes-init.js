#!/usr/bin/env node

require('../helpers/checkIsProjectFolder')

const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const base = process.cwd()

console.log()
console.log(chalk.yellow('Creating folders...'))
console.log('-------------------')

;[
  'server',
  'server/api',
  'web',
  'public',
  'storage',
  'storage/logs',
  'storage/tmp',
  'conf',
  'conf/nginx'
]
  .map(item => {
    const folder = path.join(base, item)

    try {
      fs.mkdirSync(folder)
      console.log(`${folder} ${chalk.green('created')}`)
    } catch (err) {
      console.error(`${folder} ${chalk.grey('skipped')}`)
    }
  })

console.log()
console.log(chalk.yellow('Copying default files...'))
console.log('------------------------')

;[
  {
    src: 'env.example',
    dest: ['.env.example']
  },
  {
    src: 'editorconfig',
    dest: ['.editorconfig']
  },
  {
    src: 'gulpfile.js',
    dest: ['gulpfile.js']
  },
  {
    src: 'knexfile.js',
    dest: ['knexfile.js']
  },
  {
    src: 'webpack.config.js',
    dest: ['webpack.config.js']
  },
  {
    src: 'webpack.production.js',
    dest: ['webpack.production.js']
  },
  {
    src: 'project.gitignore',
    dest: ['.gitignore']
  },
  {
    src: 'foldercontents.gitignore',
    dest: ['public/.gitignore', 'storage/.gitignore', 'storage/logs/.gitignore', 'storage/tmp/.gitignore']
  },
  {
    src: 'nginx.conf',
    dest: ['conf/nginx/app.conf']
  },
  {
    src: 'index.js',
    dest: ['index.js']
  }
]
  .map(item => {
    item.dest.map(d => {
      try {
        const target = path.join(base, d)
        if (fs.existsSync(target)) {
          console.log(`${base}/${d} ${chalk.gray('skipped')}`)
        } else {
          fs.copyFileSync(path.resolve(__dirname, '../initfiles/' + item.src), target)
          console.log(`${base}/${d} ${chalk.green('copied')}`)
        }
      } catch (err) {
        console.error(`${base}/${d} ${chalk.red('error')}`)
      }
    })
  })

const packageFile = path.join(base, 'package.json')
const packageData = require(packageFile)

packageData.scripts = Object.assign({}, {
  start: 'boxes start',
  'server:start': 'boxes start',
  'server:dev': 'nodemon --watch server --exec "boxes start"',
  build: 'gulp',
  watch: 'gulp watch',
  'migrate:make': 'knex --knexfile node_modules/boxescms migrate:make',
  'migrate:latest': 'knex --knexfile node_modules/boxescms migrate:latest',
  'migrate:rollback': 'knex --knexfile node_modules/boxescms migrate:rollback'
}, packageData.scripts)

fs.writeFileSync(packageFile, JSON.stringify(packageData, null, 2))

console.log()
console.log(chalk.yellow('Updated package.json with default scripts'))

console.log()

console.log(chalk.green('Success!'))

console.log()
console.log(chalk.green('Boxes CMS'))
console.log('---------')
console.log('1. Run `' + chalk.blue('boxes generateAppKey') + '` to get a randomised app key.')
console.log('2. Update .env with APP_KEY and APP_PORT, and DB as well if required.')
console.log('3. Run `' + chalk.blue('npm start') + '` to start the server.')
console.log('---------')
console.log()
