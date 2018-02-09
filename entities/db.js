const {join} = require('path')

const db = require('knex')(require(join(process.cwd(), 'knexfile.js')))

module.exports = db
