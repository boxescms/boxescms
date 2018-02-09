const base = process.cwd()
const {join, relative, dirname} = require('path')
const {promisify} = require('util')
const glob = promisify(require('glob'))
const fs = require('fs')
const copyFile = promisify(fs.copyFile)
const writeFile = promisify(fs.writeFile)
const mkdirp = promisify(require('mkdirp'))
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')

const buildJpgPng = async () => {
  const files = await glob(join(base, 'web/**/*.{jpg,png}'))

  return Promise.all(files.map(async file => {
    const result = await imagemin([file], {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({quality: '65-80'})
      ]
    })

    const relativepath = relative(join(base, 'web'), file)
    const target = join(base, 'public', relativepath)

    await mkdirp(dirname(target))

    return writeFile(target, result[0].data)
  }))
}

const buildRemainingImages = async () => {
  const files = await glob(join(base, 'web/**/*.{svg,gif,mp4}'))

  return Promise.all(files.map(file => {
    const relativepath = relative(join(base, 'web'), file)

    return copyFile(file, join(base, 'public', relativepath))
  }))
}

module.exports = () => Promise.all([buildJpgPng(), buildRemainingImages()])
