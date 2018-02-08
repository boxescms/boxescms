const base = process.cwd()
const {join} = require('path')
const {src, dest} = require('gulp')

module.exports = () => new Promise((resolve, reject) => {
  src(join(base, 'web/**/*.{png,jpg,gif,svg}'))
    .pipe(dest(join(base, 'public')))
    .on('end', () => {
      resolve()
    })
})
