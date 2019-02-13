// Deprecated

const { join } = require('path')
const knex = require('knex')
const knexdata = require(join(process.cwd(), 'knexfile.js'))

module.exports = () => knex(knexdata)
