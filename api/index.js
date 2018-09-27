const glob = require('glob')
const { resolve, relative, join, dirname, basename } = require('path')
const express = require('express')
const router = express.Router()

router.use(express.json())

glob.sync(resolve(__dirname, '**/*.js'))
  .map(file => {
    const relativepath = relative(__dirname, file)
    const apipath = join(dirname(relativepath), basename(relativepath, '.js'))

    if (apipath === 'index') {
      return
    }

    router.use(`/api/${apipath}`, require(file))
  })

router.use((err, req, res, next) => {
  console.error(err)

  res.status(400)
  res.json({
    message: err.message
  })
  return res.end()
})

module.exports = router
