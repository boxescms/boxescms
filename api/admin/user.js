const router = require('express').Router()
const Admin = require('../../stores/admin')
const requiredFields = require('../../middlewares/requiredFields')
const authorizeAdmin = require('../../middlewares/authorizeAdmin')
const getAdmin = require('../../middlewares/getAdmin')

router.get('/',
  getAdmin,
  authorizeAdmin,
  (req, res) => {
    res.json({
      token: req.admin.token
    })
    return res.end()
  }
)

router.put('/:username',
  getAdmin,
  authorizeAdmin,
  requiredFields('password', 'newPassword'),
  async (req, res, next) => {
    if (!Admin.exist(req.params.username)) {
      return next(new Error('Invalid credentials.'))
    }

    const admin = Admin.get(req.params.username)

    if (!admin.checkPassword(req.body.password)) {
      return next(new Error('Invalid credentials.'))
    }

    admin.setPassword(req.body.newPassword)

    await admin.save()

    res.json({
      token: admin.token
    })
    return res.end()
  }
)

router.post('/',
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

    await Admin.create({
      username: req.body.username,
      password: req.body.password,
      created: Date.now()
    })

    res.json({
      username: req.body.username
    })
    return res.end()
  }
)

router.delete('/:username',
  getAdmin,
  authorizeAdmin,
  async (req, res, next) => {
    if (!Admin.exist(req.params.username)) {
      return next(new Error('No such admin.'))
    }

    if (req.params.username === req.admin.username) {
      return next(new Error('Unauthorized.'))
    }

    await Admin.remove(req.params.username)

    res.json({
      username: req.params.username
    })
    return res.end()
  }
)

router.post('/login',
  requiredFields('username', 'password'),
  (req, res, next) => {
    if (!Admin.exist(req.body.username)) {
      return next(new Error('Invalid credentials.'))
    }

    const admin = Admin.get(req.body.username)

    if (!admin.checkPassword(req.body.password)) {
      return next(new Error('Invalid credentials.'))
    }

    res.json({
      token: admin.token
    })
  }
)

module.exports = router
