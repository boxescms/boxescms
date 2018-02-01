const base = process.cwd()
const path = require('path')
const JsonStore = require('../lib/jsonstore')

class Admin extends JsonStore {

}

Admin.primarykey = 'username'

module.exports = Admin.create(path.join(base, 'storage/admins.json'))
