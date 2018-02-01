module.exports = (req, res, next) => {
  if (!req.admin) {
    return next(new Error('Unauthorized.'))
  }

  return next()
}
