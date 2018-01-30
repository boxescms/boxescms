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

const isProduction = process.env.NODE_ENV === 'production' || process.env.ENV === 'production'

gulp.task('clean', () => del(path.join(__dirname, 'tmp/**/*.html'), {
  force: true
}))

gulp.task('prepare:normalize', () => {
  return gulp.src(path.join(__dirname, 'node_modules/normalize.css/normalize.css'))
    .pipe(gulp.dest(path.join(base, 'public/admin/static')))
})

gulp.task('hashsum', () => {
  return gulp.src(path.join(base, 'public/**/*.{png,gif,jpg,css,js,svg}'))
    .pipe(hashsum({
      dest: path.join(__dirname, 'tmp'),
      json: true,
      filename: 'hashsum.json'
    }))
})

gulp.task('compile:html', () => {
  return gulp.src([
    path.join(__dirname, 'web/pug/**/*.pug'),
    path.join(__dirname, '!web/pug/components/*.pug')
  ])
    .pipe(pug({
      locals: env.parsed
    }))
    .pipe(gulp.dest(path.join(__dirname, 'tmp')))
})

gulp.task('hash:html', () => {
  const sums = require(path.join(__dirname, 'tmp/hashsum.json'))

  const time = Date.now()

  const replacements = Object.keys(sums).map(sum => [sum, sum + '?' + time])

  return gulp.src(path.join(__dirname, 'tmp/**/*.html'))
    .pipe(replace(replacements))
    .pipe(gulp.dest(path.join(base, 'public/admin')))
})

gulp.task('build:css', () => {
  return gulp.src(path.join(__dirname, 'web/sass/**/*.sass'))
    .pipe(sass({
      indentation: true
    }))
    .pipe(autoprefix({
      browsers: browserslist
    }))
    .pipe(gulp.dest(path.join(base, 'public/admin/css')))
})

gulp.task('build:js', () => {
  return gulp.src(path.join(__dirname, 'web/js/**/*.js'))
    .pipe(named())
    .pipe(webpackStream(require(isProduction ? './webpack.production.js' : './webpack.config.js'), webpack))
    .pipe(gulp.dest(path.join(base, 'public/admin/js')))
})

gulp.task('build:assets', () => {
  return gulp.src(path.join(__dirname, 'web/assets/**'))
    .pipe(gulp.dest(path.join(base, 'public/admin/assets')))
})

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('build:css', 'build:js', 'build:assets', 'compile:html'),
  'hashsum',
  'hash:html'
))

// gulp.task('watch:html', () => gulp.watch('web/pug/**/*.pug', ['build:html']))
// gulp.task('watch:css', () => gulp.watch('web/sass/**/*.sass', ['build:css']))
// gulp.task('watch:js', () => gulp.watch(['web/js/**/*.js', 'web/components/**/*.vue', 'web/library/**/*.js'], ['build:js']))
// gulp.task('watch:assets', () => gulp.watch('web/assets/**/*', ['build:assets']))

// gulp.task('watch', gulp.series('prepare', 'build', gulp.parallel('watch:html', 'watch:css', 'watch:js', 'watch:assets')))

gulp.task('prepare', gulp.parallel('prepare:normalize'))

gulp.task('default', gulp.parallel('prepare', 'build'))

module.exports = gulp
