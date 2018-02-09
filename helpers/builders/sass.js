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
const chalk = require('chalk')

const builder = async file => {
  const time = Date.now()

  if (!file) {
    const files = await glob(join(base, 'web/sass/**/*.sass'))

    if (!files.length) {
      console.log(chalk.grey('Skipping SASS - No files to compile'))
      return
    }

    return Promise.all(files.map(builder))
  }

  const fullpath = resolve(base, file)
  const relativepath = relative(join(base, 'web', 'sass'), fullpath)
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

  await mkdirp(dirname(target))

  await writeFile(target, autoprefixResult.css)

  console.log(`Compiled ${chalk.yellow('SASS')} ${chalk.blue('[' + (Date.now() - time) + 'ms]')}`)
}

module.exports = builder
