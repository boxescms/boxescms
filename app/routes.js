const base = process.cwd()
const glob = require('glob')
const {resolve, join} = require('path')
const express = require('express')
const router = express.Router()

glob.sync(resolve(base, 'server/routes/**/*.js'))
  .map(file => router.use('/', require(file)))

router.use(express.static(join(base, 'public'), {
  extensions: ['html']
}))
router.use('/static', express.static(join(base, 'web/static')))

module.exports = router
