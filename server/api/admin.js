const fs = require('fs')
const path = require('path')
const base = process.cwd()

const storageFile = path.join(base, 'storage/admins.json')

if (!fs.existsSync(storageFile)) {
  fs.writeFileSync(storageFile, '{}')
}

const admins = require(storageFile)

const router = require('express').Router()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
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
    if (!admins[req.body.username]) {
      return next(new Error('Invalid credentials.'))
    }

    const hash = crypto.createHash('sha512')

    const hashedPassword = hash.update(req.body.password + admins[req.body.username].salt + process.env.APP_KEY).digest('hex')

    if (admins[req.body.username].password !== hashedPassword) {
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
  (req, res, next) => {
    const totalAdmins = Object.keys(admins).length

    if (totalAdmins && !req.admin) {
      return next(new Error('Unauthorized.'))
    }

    if (admins[req.body.username]) {
      return next(new Error('Admin exist.'))
    }

    const hash = crypto.createHash('sha512')
    const salt = crypto.randomBytes(64).toString('hex')

    const hashedPassword = hash.update(req.body.password + salt + process.env.APP_KEY).digest('hex')

    admins[req.body.username] = {
      password: hashedPassword,
      salt
    }

    fs.writeFileSync(storageFile, JSON.stringify(admins, null, 2))

    res.json({
      username: req.body.username
    })
    return res.end()
  })

router.delete('/',
  getAdmin,
  authorizeAdmin,
  requiredFields('username'),
  (req, res, next) => {
    if (!admins[req.body.username]) {
      return next(new Error('No such admin.'))
    }

    if (req.body.username === req.admin) {
      return next(new Error('Unauthorized.'))
    }

    delete admins[req.body.username]

    fs.writeFileSync(storageFile, JSON.stringify(admins, null, 2))

    res.json({
      username: req.body.username
    })
    return res.end()
  })

module.exports = router
