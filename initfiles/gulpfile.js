const env = require('dotenv').config()

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
const {browserslist} = require('./package.json')

const isProduction = process.env.NODE_ENV === 'production' || process.env.ENV === 'production'

const paths = {
  pug: {
    src: ['web/pug/**/*.pug', '!web/pug/components/*.pug'],
    dest: 'tmp',
    watch: 'web/pug/**/*.pug'
  },
  html: {
    src: 'tmp/**/*.html',
    dest: 'public'
  },
  js: {
    src: 'web/js/**/*.js',
    dest: 'public/js',
    watch: ['web/js/**/*.js', 'web/components/**/*.vue', 'web/library/**/*.js']
  },
  sass: {
    src: 'web/sass/**/*.sass',
    dest: 'public/css',
    watch: 'web/sass/**/*.sass'
  },
  assets: {
    src: 'web/assets/**',
    dest: 'public/assets',
    watch: 'web/assets/**'
  },
  hashsum: {
    src: 'public/**/*.{png,gif,jpg,css,js,svg}',
    dest: 'tmp/hashsum.json'
  },
  webpackConfig: path.join(__dirname, isProduction ? 'webpack.production.js' : 'webpack.config.js')
}

gulp.task('clean', () => del(paths.html.src))

gulp.task('prepare:normalize', () => {
  return gulp.src(path.join(__dirname, 'node_modules/normalize.css/normalize.css'))
    .pipe(gulp.dest('public/static'))
})

gulp.task('hashsum', () => {
  return gulp.src(paths.hashsum.src)
    .pipe(hashsum({
      dest: path.dirname(paths.hashsum.dest),
      json: true,
      filename: path.basename(paths.hashsum.dest)
    }))
})

gulp.task('compile:html', () => {
  return gulp.src(paths.pug.src)
    .pipe(pug({
      locals: env.parsed
    }))
    .pipe(gulp.dest(paths.pug.dest))
})

gulp.task('hash:html', () => {
  const sums = require(path.join(__dirname, paths.hashsum.dest))

  const time = Date.now()

  const replacements = Object.keys(sums).map(file => [file, file + '?' + (sums[file] || time)])

  return gulp.src(paths.html.src)
    .pipe(replace(replacements))
    .pipe(gulp.dest(path.html.dest))
})

gulp.task('build:css', () => {
  return gulp.src(paths.sass.src)
    .pipe(sass({
      indentation: true
    }))
    .pipe(autoprefix({
      browsers: browserslist
    }))
    .pipe(gulp.dest(paths.sass.dest))
})

gulp.task('build:js', () => {
  return gulp.src(paths.js.src)
    .pipe(named())
    .pipe(webpackStream(require(paths.webpackConfig), webpack))
    .pipe(gulp.dest(paths.js.dest))
})

gulp.task('build:assets', () => {
  return gulp.src(paths.assets.src)
    .pipe(gulp.dest(paths.assets.dest))
})

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('build:css', 'build:js', 'build:assets', 'compile:html'),
  'hashsum',
  'hash:html'
))

gulp.task('watch:html', () => gulp.watch(paths.pug.watch, gulp.series('compile:html', 'build:html')))
gulp.task('watch:css', () => gulp.watch(paths.sass.watch, 'build:css'))
gulp.task('watch:js', () => gulp.watch(paths.js.watch, 'build:js'))
gulp.task('watch:assets', () => gulp.watch(paths.assets.watch, 'build:assets'))

gulp.task('watch', gulp.series('prepare', 'build', gulp.parallel('watch:html', 'watch:css', 'watch:js', 'watch:assets')))

gulp.task('prepare', gulp.parallel('prepare:normalize'))

gulp.task('default', gulp.parallel('prepare', 'build'))

module.exports = gulp
