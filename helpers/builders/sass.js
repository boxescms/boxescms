const base = process.cwd()
const {join, resolve, relative, dirname, basename} = require('path')
const {browserslist} = require(resolve(__dirname, '../../package.json'))
const {promisify} = require('util')
const glob = promisify(require('glob'))
const sass = promisify(require('node-sass').render)
const writeFile = promisify(require('fs').writeFile)
const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const mkdirp = promisify(require('mkdirp'))

const builder = async file => {
  if (!file) {
    const files = await glob(join(base, 'web/sass/**/*.sass'))

    return Promise.all(files.map(builder))
  }

  const fullpath = resolve(base, file)
  const relativepath = relative(join(base, 'web/sass'), fullpath)
  const dir = dirname(relativepath)
  const filename = basename(relativepath, '.sass')
  const target = join(base, 'public', 'css', dir, `${filename}.css`)

  const sassResult = await sass({
    file: fullpath,
    outputStyle: 'compressed'
  })

  const autoprefixResult = await postcss([autoprefixer({
    browsers: browserslist
  })]).process(sassResult.css.toString())

  await mkdirp(join(base, 'public', 'css', dir))

  return writeFile(target, autoprefixResult.css)
}

module.exports = builder
