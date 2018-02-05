module.exports = (...fields) => {
  return (req, res, next) => {
    if (fields.find(field => req.body[field] === undefined)) {
      return next(new Error('Insufficient data.'))
    }

    return next()
  }
}
