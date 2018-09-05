const base = process.cwd()
const {promisify} = require('util')
const {join, resolve, relative, dirname, basename, extname} = require('path')
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

const getData = async namespace => {
  const data = {}

  const datafileJS = join(base, 'data', `${namespace}.js`)
  const globalfileJS = join(base, 'data', 'global.js')

  const datafileJSON = join(base, 'data', `${namespace}.json`)
  const globalfileJSON = join(base, 'data', 'global.json')

  const datafileYML = join(base, 'data', `${namespace}.yml`)
  const globalfileYML = join(base, 'data', 'global.yml')

  if (fs.existsSync(globalfileJS)) {
    delete require.cache[globalfileJS]

    mergeWith(data, await Promise.resolve(require(globalfileJS)), (obj, src) => src)
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
    mergeWith(data, await Promise.resolve(require(datafileJS)), (obj, src) => src)
  }

  if (fs.existsSync(datafileJSON)) {
    delete require.cache[datafileJSON]
    mergeWith(data, require(datafileJSON), (obj, src) => src)
  }

  if (fs.existsSync(datafileYML)) {
    const dataYML = await readFile(datafileYML)
    mergeWith(data, yml.load(dataYML))
  }

  return data
}

const generateHTML = async (template, target, data, sums) => {
  let html = pug.renderFile(template, data)

  Object.keys(sums).map(file => {
    const sum = sums[file]

    html = html.replace(new RegExp(file, 'g'), `${file}?${sum}`)
  })

  await mkdirp(dirname(target))

  return writeFile(target, html)
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

  const data = await getData(join(dir, filename))

  return generateHTML(fullpath, target, data, sums)
}

const buildFromData = async (relativepath, sums) => {
  if (sums === undefined) {
    sums = await buildHashsum()
  }

  const data = await getData(relativepath)

  if (!data['.template']) {
    return
  }

  const templateFile = join(base, 'web/template', data['.template'])

  if (!fs.existsSync(templateFile)) {
    return
  }

  return generateHTML(templateFile, join(base, 'public', relativepath + '.html'), data, sums)
}

const builder = async file => {
  const sums = await buildHashsum()

  if (!file) {
    const files = await glob(join(base, 'web/pug/**/*.pug'))

    const datafiles = await glob(join(base, 'data/**/*.{js,json,yml}'))

    if (!files.length && !datafiles.length) {
      console.log(chalk.grey('Skipping PUG - No files to compile'))
      return
    }

    await Promise.all(files.map(file => buildPug(file, sums)))

    const relativefiles = files
      .map(file => relative(join(base, 'web/pug'), file))
      .map(file => join(dirname(file), basename(file, extname(file))))

    const relativedatafiles = [...new Set(datafiles
      .map(file => relative(join(base, 'data'), file))
      .map(file => join(dirname(file), basename(file, extname(file))))
      .filter(file => !relativefiles.includes(file)))]

    await Promise.all(relativedatafiles.map(file => buildFromData(file, sums)))

    console.log(`${chalk.yellow('PUG')} last compiled at ${chalk.blue('[' + (new Date()) + ']')}`)

    return
  }

  await buildPug(file, sums)

  console.log(`${chalk.yellow('PUG')} last compiled at ${chalk.blue('[' + (new Date()) + ']')}`)
}

module.exports = builder
