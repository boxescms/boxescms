const env = require('dotenv').config()

const base = process.cwd()
const path = require('path')
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
const {browserslist} = require(path.join(__dirname, 'package.json'))

const {task, src, dest, watch, parallel, series} = gulp

const isProduction = process.env.NODE_ENV === 'production' || process.env.ENV === 'production'

task('clean', () => del(path.join(__dirname, 'tmp/**/*.html'), {
  force: true
}))

task('prepare:normalize', () => {
  return src(path.join(__dirname, 'node_modules/normalize.css/normalize.css'))
    .pipe(dest(path.join(base, 'public/admin/static')))
})

task('hashsum', () => {
  return src(path.join(base, 'public/**/*.{png,gif,jpg,css,js,svg}'))
    .pipe(hashsum({
      dest: path.join(__dirname, 'tmp'),
      json: true,
      filename: 'hashsum.json'
    }))
})

task('compile:html', () => {
  return src([
    path.join(__dirname, 'web/pug/**/*.pug'),
    path.join(__dirname, '!web/pug/components/*.pug')
  ])
    .pipe(pug({
      locals: env.parsed
    }))
    .pipe(dest(path.join(__dirname, 'tmp')))
})

task('hash:html', () => {
  const sums = require(path.join(__dirname, 'tmp/hashsum.json'))

  const time = Date.now()

  const replacements = Object.keys(sums).map(sum => [sum, sum + '?' + time])

  return src(path.join(__dirname, 'tmp/**/*.html'))
    .pipe(replace(replacements))
    .pipe(dest(path.join(base, 'public/admin')))
})

task('build:css', () => {
  return src(path.join(__dirname, 'web/sass/**/*.sass'))
    .pipe(sass({
      indentation: true
    }))
    .pipe(autoprefix({
      browsers: browserslist
    }))
    .pipe(dest(path.join(base, 'public/admin/css')))
})

task('build:js', () => {
  return src(path.join(__dirname, 'web/js/**/*.js'))
    .pipe(named())
    .pipe(webpackStream(require(isProduction ? './webpack.production.js' : './webpack.config.js'), webpack))
    .pipe(dest(path.join(base, 'public/admin/js')))
})

task('build:assets', () => {
  return src(path.join(__dirname, 'web/assets/**'))
    .pipe(dest(path.join(base, 'public/admin/assets')))
})

task('build', series(
  'clean',
  parallel('build:css', 'build:js', 'build:assets', 'compile:html'),
  'hashsum',
  'hash:html'
))

task('watch:html', () => watch('web/pug/**/*.pug', ['build:html']))
task('watch:css', () => watch('web/sass/**/*.sass', ['build:css']))
task('watch:js', () => watch(['web/js/**/*.js', 'web/components/**/*.vue', 'web/library/**/*.js'], ['build:js']))
task('watch:assets', () => watch('web/assets/**/*', ['build:assets']))

task('prepare', parallel('prepare:normalize'))

task('default', parallel('prepare', 'build'))

task('watch', series('prepare', 'build', parallel('watch:html', 'watch:css', 'watch:js', 'watch:assets')))

module.exports = gulp
