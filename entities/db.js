const fs = require('fs')
const path = require('path')
const localKnexfile = path.join(process.cwd, 'knexfile.js')

const db = require('knex')(require(fs.existsSync(localKnexfile) ? localKnexfile : '../knexfile'))

module.exports = db
