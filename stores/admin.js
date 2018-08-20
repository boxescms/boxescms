const base = process.cwd()
const path = require('path')
const JsonStore = require('../lib/jsonstore')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const Admin = JsonStore({
  file: path.join(base, 'storage/admins.json'),
  primarykey: 'username'
})

Admin.prototype.init = function (data) {
  if (!data) {
    return
  }

  this.username = data.username
  this.created = data.created || new Date()

  this.setPassword(data.password)
}

Admin.prototype.checkPassword = function (password) {
  const hash = crypto.createHash('sha512')

  const [hashedPassword, salt] = this.password.split('.')

  return hashedPassword === hash.update(password + salt).digest('hex')
}

Admin.prototype.setPassword = function (password) {
  const hash = crypto.createHash('sha512')
  const salt = Date.now().toString(36) + Math.random().toString(36).replace('.', '')

  this.password = hash.update(password + salt).digest('hex') + '.' + salt

  return this.password
}

Object.defineProperty(Admin.prototype, 'token', {
  get: function () {
    return jwt.sign({
      username: this.username
    }, process.env.APP_KEY, {
      expiresIn: '1d'
    })
  }
})

module.exports = Admin
