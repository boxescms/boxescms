const base = process.cwd()
const {join, resolve, relative, dirname, basename} = require('path')
const {promisify} = require('util')
const glob = promisify(require('glob'))
const copyFile = promisify(require('fs').copyFile)
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')

const buildJpgPng = () => {
  return imagemin([join(base, 'web/**/*.{jpg,png}')], join(base, 'public'), {
    plugins: [
      imageminJpegtran(),
      imageminPngquant({quality: '65-80'})
    ]
  })
}

const buildRemainingImages = async () => {
  const files = await glob(join(base, 'web/**/*.{svg,gif,mp4}'))

  return Promise.all(files.map(file => {
    const relativepath = relative(join(base, 'web'), file)

    return copyFile(file, join(base, 'public', relativepath))
  }))
}

module.exports = () => Promise.all([buildJpgPng(), buildRemainingImages()])
