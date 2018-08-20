#!/usr/bin/env node

require('dotenv').config()

const program = require('commander')
const {blue, yellow, red} = require('chalk')
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

  await Admin.create({
    username: input.username,
    password: input.password,
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
