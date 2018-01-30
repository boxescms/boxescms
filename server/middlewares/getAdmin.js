const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const base = process.cwd()

const storageFile = path.join(base, 'storage/admins.json')

if (!fs.existsSync(storageFile)) {
  fs.writeFileSync(storageFile, '{}')
}

const admins = require(storageFile)

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return next()
  }

  const [authType, authToken] = req.headers.authorization.split(' ')

  if (authType !== 'Bearer') {
    return next()
  }

  let token

  try {
    token = jwt.verify(authToken, process.env.APP_KEY)
  } catch (err) {
    return next()
  }

  if (!admins[token.username]) {
    return next()
  }

  req.admin = token.username

  next()
}
