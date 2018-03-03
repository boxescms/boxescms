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

  const datafileJS = join(base, 'data', dir, `${filename}.js`)
  const globalfileJS = join(base, 'data', 'global.js')

  const datafileJSON = join(base, 'data', dir, `${filename}.json`)
  const globalfileJSON = join(base, 'data', 'global.json')

  const datafileYML = join(base, 'data', dir, `${filename}.yml`)
  const globalfileYML = join(base, 'data', 'global.yml')

  const data = {}

  if (fs.existsSync(globalfileJS)) {
    delete require.cache[globalfileJS]
    mergeWith(data, require(globalfileJS), (obj, src) => src)
  }

  if (fs.existsSync(globalfileJSON)) {
    delete require.cache[globalfileJSON]
    mergeWith(data, require(globalfileJSON), (obj, src) => src)
  }

  if (fs.existsSync(globalfileYML)) {
    const globalYML = await readFile(globalfileYML)
    mergeWith(data, yml.load(globalYML))
  }

  if (fs.existsSync(datafileJS)) {
    delete require.cache[datafileJS]
    mergeWith(data, require(datafileJS), (obj, src) => src)
  }

  if (fs.existsSync(datafileJSON)) {
    delete require.cache[datafileJSON]
    mergeWith(data, require(datafileJSON), (obj, src) => src)
  }

  if (fs.existsSync(datafileYML)) {
    const dataYML = await readFile(datafileYML)
    mergeWith(data, yml.load(dataYML))
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
