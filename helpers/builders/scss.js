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
const mustache = require('mustache')

const builder = async file => {
  if (!file) {
    const files = await glob(join(base, 'web/scss/**/*.scss'))

    if (!files.length) {
      console.log(chalk.grey('Skipping SCSS - No files to compile'))
      return
    }

    await Promise.all(files.map(builder))

    console.log(`${chalk.yellow('SCSS')} last compiled at ${chalk.blue('[' + (new Date()) + ']')}`)

    return
  }

  const fullpath = resolve(base, file)
  const relativepath = relative(join(base, 'web', 'scss'), fullpath)
  const dir = dirname(relativepath)
  const filename = basename(relativepath, '.scss')
  const target = join(base, 'public', 'css', dir, `${filename}.css`)

  const sassResult = await sass({
    file: fullpath,
    outputStyle: 'compressed'
  })

  const cssString = mustache.render(sassResult.css.toString(), process.env)

  const autoprefixResult = await postcss([autoprefixer({
    browsers: browserslist
  })]).process(cssString)

  await mkdirp(dirname(target))

  await writeFile(target, autoprefixResult.css)
}

module.exports = builder
