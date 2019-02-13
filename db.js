const { join } = require('path')
const knex = require('knex')

const loadedKnexConfigs = {}
const loadedKnexInstances = {}

function db (namespace) {
  if (!namespace) {
    namespace = 'default'
  }

  if (!loadedKnexConfigs[namespace]) {
    loadedKnexConfigs[namespace] = require(join(process.cwd(), 'knexfile' + (namespace === 'default' ? '' : '.' + namespace) + '.js'))
  }

  return knex(loadedKnexConfigs[namespace])
}

db.instance = function dbInstance (namespace) {
  if (!namespace) {
    namespace = 'default'
  }

  if (!loadedKnexInstances[namespace]) {
    loadedKnexInstances[namespace] = db(namespace)
  }

  return loadedKnexInstances[namespace]
}

module.exports = db
