#!/usr/bin/env node

require('../helpers/checkIsProjectFolder')

const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const base = process.cwd()
const { browserslist } = require('../package.json')
const crypto = require('crypto')

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
  'conf/nginx',
  '.vscode'
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
    src: 'gitlab-ci.yml',
    dest: ['.gitlab-ci.yml']
  },
  {
    src: 'env.example',
    dest: ['.env.example', '.env']
  },
  {
    src: 'editorconfig',
    dest: ['.editorconfig']
  },
  {
    src: 'knexfile.js',
    dest: ['knexfile.js']
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
    src: 'vscodelaunch.json',
    dest: ['.vscode/launch.json']
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
  dev: 'boxes build && boxes start dev',
  'server:start': 'boxes start',
  'server:dev': 'boxes start dev',
  build: 'boxes build',
  watch: 'boxes watch'
}, packageData.scripts)

if (!packageData.scripts['lint:js']) {
  packageData.scripts['lint:js'] = 'standard'
}

if (!packageData.scripts['lint:vue']) {
  packageData.scripts['lint:vue'] = 'eslint --ext .vue web'
}

if (!packageData.scripts['lint:pug']) {
  packageData.scripts['lint:pug'] = 'pug-lint web'
}

if (!packageData.browserslist) {
  packageData.browserslist = browserslist
}

if (!packageData.standard) {
  packageData.standard = {
    parser: 'babel-eslint'
  }
}

if (!packageData.eslintConfig) {
  packageData.eslintConfig = {
    extends: [
      'plugin:vue/essential',
      'standard'
    ],
    parserOptions: {
      parser: 'babel-eslint'
    }
  }
}

fs.writeFileSync(packageFile, JSON.stringify(packageData, null, 2))

const envfile = path.join(base, '.env')
let envcontent = fs.readFileSync(envfile, 'utf8')

let appkey

const searchAPPKEY = (/APP_KEY=(.*)\n/gm).exec(envcontent)

if (searchAPPKEY === null || searchAPPKEY[1] === '') {
  appkey = crypto.randomBytes(32).toString('hex')

  if (searchAPPKEY === null) {
    envcontent = `APP_KEY=${appkey}\n` + envcontent
  }

  if (searchAPPKEY && searchAPPKEY[1] === '') {
    envcontent = envcontent.replace(/APP_KEY=(.*)\n/gm, `APP_KEY=${appkey}\n`)
  }

  fs.writeFileSync(envfile, envcontent, 'utf8')
}

console.log()
console.log(chalk.yellow('Updated package.json with default scripts'))

console.log()

console.log(chalk.green('Success!'))

console.log()
console.log(chalk.green('Boxes CMS'))
console.log('---------')

console.log(`** .env **`)
if (appkey) {
  console.log(`* APP_KEY has been initialised to: ${appkey}`)
  console.log('* Run `' + chalk.blue('boxes generateAppKey') + '` to regenerate a randomised app key.')
}

console.log('* Update .env APP_PORT and DB_* if required.')

console.log()
console.log('** Start Server **')
console.log('* Run `' + chalk.blue('npm start') + '` or `' + chalk.blue('yarn start') + '` to start the server.')
console.log('* Run `' + chalk.blue('npm run dev') + '` or `' + chalk.blue('yarn dev') + '` to start the server in watch mode.')
console.log('---------')
console.log()
