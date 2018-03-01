require('dotenv').config()

const base = process.cwd()
const {promisify} = require('util')
const {join, resolve, relative, dirname, basename} = require('path')
const fs = require('fs')
const pug = require('pug')
const glob = promisify(require('glob'))
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const crypto = require('crypto')
const mkdirp = promisify(require('mkdirp'))
const chalk = require('chalk')
const mergeWith = require('lodash/mergeWith')
const yml = require('js-yaml')

const buildHashsum = async () => {
  const files = await glob(join(base, 'public', '**/*.{css,js,jpg,png,svg,gif,mp4}'))

  const sums = {}

  await Promise.all(files.map(async file => {
    const contents = await readFile(file)
    const relativepath = relative(join(base, 'public'), file)

    const hash = crypto.createHash('sha256').update(contents).digest('hex')

    sums[relativepath] = hash
  }))

  return sums
}

const buildPug = async (file, sums) => {
  if (sums === undefined) {
    sums = await buildHashsum()
  }

  const fullpath = resolve(base, file)
  const relativepath = relative(join(base, 'web', 'pug'), fullpath)
  const dir = dirname(relativepath)
  const filename = basename(relativepath, '.pug')
  const target = join(base, 'public', dir, `${filename}.html`)
  const datafile = join(base, 'data', dir, `${filename}.js`)
  const globalfile = join(base, 'data', 'global.js')
  const datayml = join(base, 'data', dir, `${filename}.yml`)
  const globalyml = join(base, 'data', 'global.yml')

  const data = {}

  if (fs.existsSync(globalfile)) {
    delete require.cache[globalfile]
    mergeWith(data, require(globalfile), (obj, src) => src)
  }

  if (fs.existsSync(globalyml)) {
    const globalymldata = await readFile(globalyml)
    mergeWith(data, yml.load(globalymldata))
  }

  if (fs.existsSync(datafile)) {
    delete require.cache[datafile]
    mergeWith(data, require(datafile), (obj, src) => src)
  }

  if (fs.existsSync(datayml)) {
    const dataymldata = await readFile(datayml)
    mergeWith(data, yml.load(dataymldata))
  }

  let html = pug.renderFile(fullpath, data)

  Object.keys(sums).map(file => {
    const sum = sums[file]

    html = html.replace(new RegExp(file, 'g'), `${file}?${sum}`)
  })

  await mkdirp(dirname(target))

  return writeFile(target, html)
}

const builder = async file => {
  const time = Date.now()

  const sums = await buildHashsum()

  if (!file) {
    const files = await glob(join(base, 'web/pug/**/*.pug'))

    if (!files.length) {
      console.log(chalk.grey('Skipping PUG - No files to compile'))
      return
    }

    await Promise.all(files.map(file => buildPug(file, sums)))

    console.log(`Compiled ${chalk.yellow('PUG')} ${chalk.blue('[' + (Date.now() - time) + 'ms]')}`)

    return
  }

  await buildPug(file, sums)

  console.log(`Compiled ${chalk.yellow('PUG')} ${chalk.blue('[' + (Date.now() - time) + 'ms]')}`)
}

module.exports = builder
