const router = require('express').Router()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Admin = require('../stores/admin')
const requiredFields = require('../middlewares/requiredFields')
const authorizeAdmin = require('../middlewares/authorizeAdmin')
const getAdmin = require('../middlewares/getAdmin')

router.get('/',
  getAdmin,
  authorizeAdmin,
  (req, res) => {
    const token = jwt.sign({
      username: req.admin
    }, process.env.APP_KEY, {
      expiresIn: '1d'
    })

    res.json({
      token
    })
    return res.end()
  })

router.post('/',
  requiredFields('username', 'password'),
  (req, res, next) => {
    if (!Admin.exist(req.body.username)) {
      return next(new Error('Invalid credentials.'))
    }

    const admin = Admin.get(req.body.username)

    const hash = crypto.createHash('sha512')

    const hashedPassword = hash.update(req.body.password + admin.salt + process.env.APP_KEY).digest('hex')

    if (admin.password !== hashedPassword) {
      return next(new Error('Invalid credentials.'))
    }

    const token = jwt.sign({
      username: req.body.username
    }, process.env.APP_KEY, {
      expiresIn: '1d'
    })

    res.json({
      token
    })
    return res.end()
  })

router.put('/',
  getAdmin,
  requiredFields('username', 'password'),
  async (req, res, next) => {
    const totalAdmins = Admin.count()

    if (totalAdmins && !req.admin) {
      return next(new Error('Unauthorized.'))
    }

    if (Admin.exist(req.body.username)) {
      return next(new Error('Admin exist.'))
    }

    const hash = crypto.createHash('sha512')
    const salt = crypto.randomBytes(64).toString('hex')

    const hashedPassword = hash.update(req.body.password + salt + process.env.APP_KEY).digest('hex')

    await Admin.create({
      username: req.body.username,
      password: hashedPassword,
      salt,
      created: Date.now()
    })

    res.json({
      username: req.body.username
    })
    return res.end()
  })

router.delete('/',
  getAdmin,
  authorizeAdmin,
  requiredFields('username'),
  async (req, res, next) => {
    if (!Admin.exist(req.body.username)) {
      return next(new Error('No such admin.'))
    }

    if (req.body.username === req.admin) {
      return next(new Error('Unauthorized.'))
    }

    await Admin.remove(req.body.username)

    res.json({
      username: req.body.username
    })
    return res.end()
  })

module.exports = router
