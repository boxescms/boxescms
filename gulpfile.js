const env = require('dotenv').config()

const base = process.cwd()
const {join} = require('path')
const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefix = require('gulp-autoprefixer')
const pug = require('gulp-pug')
const hashsum = require('gulp-hashsum')
const replace = require('gulp-batch-replace')
const del = require('del')
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
const named = require('vinyl-named')
const {browserslist} = require(join(__dirname, 'package.json'))

const {task, src, dest, watch, parallel, series} = gulp

const isProduction = process.env.NODE_ENV === 'production' || process.env.ENV === 'production'

task('clean', () => del(join(base, 'public/admin/**/*'), {
  force: true
}))

task('prepare:normalize', () => {
  return src(join(__dirname, 'node_modules/normalize.css/normalize.css'))
    .pipe(dest(join(base, 'public/admin/static')))
})

task('build:hashsum', () => {
  return src(join(base, 'public/admin/**/*.{png,gif,jpg,css,js,svg}'))
    .pipe(hashsum({
      dest: join(__dirname, 'public/admin'),
      json: true,
      filename: 'hashsum.json'
    }))
})

task('build:html', () => {
  const sums = require(join(__dirname, 'public/admin/hashsum.json'))

  const replacements = Object.keys(sums).map(file => [file, file + '?' + sums[file]])

  return src([
    join(__dirname, 'web/pug/**/*.pug'),
    join(__dirname, '!web/pug/components/*.pug')
  ])
    .pipe(pug({
      locals: env.parsed
    }))
    .pipe(replace(replacements))
    .pipe(dest(join(base, 'public/admin')))
})

task('build:css', () => {
  return src(join(__dirname, 'web/sass/**/*.sass'))
    .pipe(sass({
      indentation: true
    }))
    .pipe(autoprefix({
      browsers: browserslist
    }))
    .pipe(dest(join(base, 'public/admin/css')))
})

task('build:js', () => {
  return src(join(__dirname, 'web/js/**/*.js'))
    .pipe(named())
    .pipe(webpackStream(require(isProduction ? './webpack.production.js' : './webpack.config.js'), webpack))
    .pipe(dest(join(base, 'public/admin/js')))
})

task('build:assets', () => {
  return src(join(__dirname, 'web/assets/**'))
    .pipe(dest(join(base, 'public/admin/assets')))
})

task('build', series(
  'clean',
  parallel('build:css', 'build:js', 'build:assets'),
  'build:hashsum',
  'build:html'
))

task('watch:html', () => watch('web/pug/**/*.pug', series('build:hashsum', 'build:html')))
task('watch:css', () => watch('web/sass/**/*.sass', parallel('build:css')))
task('watch:js', () => watch(['web/js/**/*.js', 'web/components/**/*.vue', 'web/library/**/*.js'], parallel('build:js')))
task('watch:assets', () => watch('web/assets/**/*', parallel('build:assets')))

task('prepare', parallel('prepare:normalize'))

task('default', parallel('prepare', 'build'))

task('watch', series('default', parallel('watch:css', 'watch:js', 'watch:assets', 'watch:html')))
