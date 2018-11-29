const base = process.cwd()
const chokidar = require('chokidar')
const chalk = require('chalk')
const { fork } = require('child_process')
const { existsSync } = require('fs')
const crypto = require('crypto')

let server
let restartThrottle

const killauth = crypto.randomBytes(32).toString('hex')

const startDevServer = () => {
  const indexfile = existsSync('node_modules/boxescms/index.js') ? 'node_modules/boxescms/index.js' : 'index.js'

  const execArgv = []

  if (process.env.BOXES_INSPECTPORT) {
    execArgv.push(`--inspect=${process.env.BOXES_INSPECTPORT}`)
  }

  server = fork(indexfile, [], {
    stdio: 'inherit',
    execArgv
  })

  server.send({
    key: 'init',
    value: killauth
  })
}

module.exports = () => {
  console.log(chalk.blue('Watching Server ') + chalk.yellow('[server/**]'))

  startDevServer()

  const watcher = chokidar.watch([
    'server/**'
  ], {
    cwd: base
  })

  watcher.on('change', () => {
    clearTimeout(restartThrottle)

    restartThrottle = setTimeout(() => {
      console.log(`Restarting ${chalk.yellow('Server')} at ${chalk.blue('[' + (new Date()) + ']')}`)

      server.send({
        key: 'kill',
        value: killauth
      })

      startDevServer()
    }, 500)
  })

  return watcher
}
