const router = require('express').Router()
const requiredFields = require('../../middlewares/requiredFields')
const authorizeAdmin = require('../../middlewares/authorizeAdmin')
const getAdmin = require('../../middlewares/getAdmin')

router.get('/:file',
  getAdmin,
  authorizeAdmin,
  (req, res) => {
    return res.end()
  })

module.exports = router
