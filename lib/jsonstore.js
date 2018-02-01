const fs = require('fs')
const {promisify} = require('util')

class JsonStore {
  constructor (file) {
    this.file = file || this.constructor.file || (this.constructor.name.toLowerCase() + '.json')

    if (!fs.existsSync(this.file)) {
      fs.writeFileSync(this.file, '[]')
    }

    this.data = require(this.file)

    this.refreshIndex()
  }

  static create (file) {
    return new this(file || this.file)
  }

  refreshIndex () {
    this.index = {}

    this.data.map((item, index) => {
      this.index[item[this.constructor.primarykey]] = index
    })
  }

  async write () {
    await promisify(fs.writeFile)(this.file, JSON.stringify(this.data))

    return this
  }

  count () {
    return this.data.length
  }

  save () {
    return this.write()
  }

  exist (key) {
    return !!this.get(key)
  }

  get (key) {
    return this.data[this.index[key]]
  }

  set (key, value) {
    this.data[this.index[key]] = value

    return this.save()
  }

  update (key, value) {
    return this.set(key, value)
  }

  push (...value) {
    this.data.push(...value)

    this.refreshIndex()

    return this.save()
  }

  create (...value) {
    return this.push(...value)
  }

  remove (key) {
    delete this.data[this.index[key]]

    this.refreshIndex()

    return this.save()
  }
}

JsonStore.primarykey = 'id'

;['map', 'filter', 'find', 'reduce', 'every', 'some'].map(key => {
  JsonStore.prototype[key] = function (...args) {
    return this.data[key](...args)
  }
})

module.exports = JsonStore
