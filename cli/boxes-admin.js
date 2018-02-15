#!/usr/bin/env node

require('dotenv').config()

const program = require('commander')
const {blue, yellow, red} = require('chalk')
const crypto = require('crypto')
const Admin = require('../stores/admin')
const {log} = console

const input = {
  username: '',
  password: ''
}

program
  .arguments('<username> <password>')
  .action((username, password) => {
    input.username = username
    input.password = password
  })
  .parse(process.argv)

;(async () => {
  if (!input.username || !input.password) {
    log(red('Username and password is required.'))
    return
  }

  if (Admin.exist(input.username)) {
    log(red(`${input.username} already exist.`))
    return
  }

  const hash = crypto.createHash('sha512')
  const salt = crypto.randomBytes(64).toString('hex')

  const hashedPassword = hash.update(input.password + salt + process.env.APP_KEY).digest('hex')

  await Admin.create({
    username: input.username,
    password: hashedPassword,
    salt,
    created: Date.now()
  })

  log()
  log('---------------')
  log('Admin Created:')
  log()
  log(blue('Username: ') + yellow(input.username))
  log(blue('Password: ') + yellow(input.password))
  log('---------------')
  log()
})()
