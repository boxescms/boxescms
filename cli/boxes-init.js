#!/usr/bin/env node

require('../helpers/checkIsProjectFolder')

const fs = require('fs')
const path = require('path')
const base = process.cwd()

;[
  'server',
  'server/api',
  'web',
  'public',
  'storage',
  'storage/logs',
  'storage/tmp',
  'migrations',
  'seeds',
  'conf',
  'conf/nginx'
]
  .map(item => {
    const folder = path.join(base, item)

    try {
      fs.mkdirSync(folder)
      console.info(`${item} created`)
    } catch (err) {
      console.error(`${item} exist`)
    }
  })

;['.env.example', 'gulpfile.js']
  .map(item => {
    const file = path.resolve(__dirname, '../initfiles', item)

    try {
      fs.copyFileSync(file, path.join(base, item))
      console.info(`${item} copied`)
    } catch (err) {
      console.log(err)
      console.error(`${item} exist`)
    }
  })

;[
  {
    src: 'env.example',
    dest: ['.env']
  },
  {
    src: 'gulpfile.js',
    dest: ['gulpfile.js']
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
  }
]
  .map(item => {
    item.dest.map(d => {
      try {
        fs.copyFileSync(path.resolve(__dirname, '../initfiles/' + item.src), path.join(base, d))
        console.info(`${base}/${d} copied`)
      } catch (err) {
        console.error(`${base}/${d} exist`)
      }
    })
  })
