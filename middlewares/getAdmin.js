const jwt = require('jsonwebtoken')
const Admin = require('../stores/admin')

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

  if (!Admin.exist(token.username)) {
    return next()
  }

  req.admin = Admin.get(token.username)

  next()
}
