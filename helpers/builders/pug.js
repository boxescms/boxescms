require('dotenv').config()

const base = process.cwd()
const {promisify} = require('util')
const {join, resolve, relative, dirname, basename} = require('path')
const fs = require('fs')
const pug = require('pug')
const glob = promisify(require('glob'))
const writeFile = promisify(require('fs').writeFile)
// const crypto = require('crypto')
const mkdirp = promisify(require('mkdirp'))

const builder = async file => {
  if (!file) {
    const files = await glob(join(base, 'web/pug/**/*.pug'))

    return Promise.all(files.map(builder))
  }

  const fullpath = resolve(base, file)
  const relativepath = relative(join(base, 'web', 'pug'), fullpath)
  const dir = dirname(relativepath)
  const filename = basename(relativepath, '.pug')
  const target = join(base, 'public', dir, `${filename}.html`)
  const datafile = join(base, 'data', dir, `${filename}.js`)

  let data = {}

  if (fs.existsSync(datafile)) {
    Object.assign(data, require(datafile))
  }

  const html = pug.renderFile(fullpath, data)

  await mkdirp(join(base, 'public', dir))

  return writeFile(target, html)
}
