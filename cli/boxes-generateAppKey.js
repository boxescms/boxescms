#!/usr/bin/env node

const crypto = require('crypto')

console.log()
console.log('Copy the following line into the project .env file')
console.log('--------------------------------------------------')
console.log()

console.log('APP_KEY=' + crypto.randomBytes(32).toString('hex'))
console.log()
