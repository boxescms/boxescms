require('../../helpers/checkIsProjectFolder')

const base = process.cwd()
const glob = require('glob')
const path = require('path')
const router = require('express').Router()
const bodyParser = require('body-parser')

router.use(bodyParser.json())

glob.sync(path.resolve(base, 'server/api/**/*.js'))
  .map(file => {
    const relative = path.relative(path.join(base, 'server', 'api'), file)
    const apipath = path.join(path.dirname(relative), path.basename(relative, '.js'))

    router.use(`/api/${apipath}`, require(file))
  })

glob.sync(path.resolve(__dirname, '**/*.js'))
  .map(file => {
    const relative = path.relative(__dirname, file)
    const apipath = path.join(path.dirname(relative), path.basename(relative, '.js'))

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
