require('dotenv').config()

module.exports = {
  client: 'mysql',
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    charset: 'utf8mb4'
  },
  pool: {
    min: process.env.DB_POOL_MIN || 2,
    max: process.env.DB_POOL_MAX || 10
  },
  migrations: {
    tableName: '_migrations'
  },
  debug: process.env.NODE_ENV !== 'production'
}
