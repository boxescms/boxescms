const fs = require('fs')
const path = require('path')

const db = require('knex')(require(path.join(process.cwd(), 'knexfile.js')))

module.exports = db
