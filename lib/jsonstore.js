const fs = require('fs')
const { promisify } = require('util')
const { dirname } = require('path')
const mkdirp = promisify(require('mkdirp'))

module.exports = function ({ file, primarykey = 'id' }) {
  const Store = function (data) {
    return this.init(data)
  }

  Store.init = function () {
    if (this.initialized) {
      return
    }

    this.initialized = true

    mkdirp.sync(dirname(file))

    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, '[]')
    }

    this.data = require(file).map(record => this.load(record))

    this.refreshIndex()
  }

  Store.file = file
  Store.primarykey = primarykey
  Store.index = {}
  Store.data = []
  Store.initialized = false

  Store.refreshIndex = function () {
    this.index = {}

    this.data.map((item, index) => {
      this.index[item[this.primarykey]] = index
    })

    return this
  }

  Store.write = async function () {
    await promisify(fs.writeFile)(this.file, JSON.stringify(this.data))

    return Store
  }

  Store.count = function () {
    if (!this.initialized) {
      Store.init()
    }

    return this.data.length
  }

  Store.exist = function (key) {
    return !!this.get(key)
  }

  Store.get = function (key) {
    if (!this.initialized) {
      Store.init()
    }

    return this.data[this.index[key]]
  }

  Store.set = function (key, value) {
    this.data[this.index[key]] = value

    return this.write()
  }

  Store.load = function (data) {
    if (!this.initialized) {
      this.init()
    }

    const record = new Store()

    Object.assign(record, data)

    return record
  }

  Store.update = function (key, value) {
    return this.set(key, value)
  }

  Store.create = async function (...value) {
    if (!this.initialized) {
      Store.init()
    }

    const result = await Promise.all(value.map(data => new this(data)))

    this.data.push(...result)

    await this.write()

    this.refreshIndex()

    return result
  }

  Store.remove = function (key) {
    if (!this.initialized) {
      Store.init()
    }

    delete this.data[this.index[key]]

    this.refreshIndex()

    return this.write()
  }

  Object.defineProperty(Store, 'length', {
    get: () => {
      return Store.count()
    }
  })

  Store.prototype.init = function (data) {
    if (data) {
      Object.assign(this, data)
    }
  }

  Store.prototype.save = function () {
    return this.constructor.write()
  }

  Store.prototype.remove = function () {
    return this.constructor.remove(this[this.constructor.primarykey])
  }

  ;['map', 'filter', 'find', 'reduce', 'every', 'some'].map(key => {
    Store.prototype[key] = function (...args) {
      return this.data[key](...args)
    }
  })

  return Store
}
