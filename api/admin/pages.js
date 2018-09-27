const base = process.cwd()
const { promisify } = require('util')
const glob = promisify(require('glob'))
const { join, relative, dirname, basename, extname } = require('path')
const router = require('express').Router()
const authorizeAdmin = require('../../middlewares/authorizeAdmin')
const getAdmin = require('../../middlewares/getAdmin')

router.get('/',
  // getAdmin,
  // authorizeAdmin,
  async (req, res) => {
    const pugfiles = await glob(join(base, 'web/pug/**/*.pug'))
    const datafiles = await glob(join(base, 'data/**/*.js'))

    const files = {}

    pugfiles.map(file => {
      const relativepath = relative(join(base, 'web/pug'), file)
      files[join(dirname(relativepath), basename(relativepath, extname(relativepath)))] = {
        pug: file
      }
    })

    datafiles.map(file => {
      const relativepath = relative(join(base, 'data'), file)

      const identifier = join(dirname(relativepath), basename(relativepath, extname(relativepath)))

      if (!files[identifier]) {
        files[identifier] = {}
      }

      files[identifier].data = file
    })

    res.json(files)

    return res.end()
  })

module.exports = router
