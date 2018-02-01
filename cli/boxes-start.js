#!/usr/bin/env node

const path = require('path')

require('dotenv').config({
  path: path.resolve(process.cwd(), '.env')
})

const gulp = require('../gulpfile')

gulp.task('default')(() => {
  require('../')
})
