require('../../helpers/checkIsProjectFolder')

const base = process.cwd()
const glob = require('glob')
const path = require('path')
const router = require('express').Router()

glob.sync(path.resolve(base, 'server/routes/**/*.js'))
  .map(file => router.use('/', require(file)))

glob.sync(path.resolve(__dirname, '**/*.js'))
  .map(file => {
    const relative = path.relative(__dirname, file)

    if (relative === 'index.js') {
      return
    }

    router.use('/', require(file))
  })

module.exports = router
