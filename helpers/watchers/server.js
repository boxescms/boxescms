const base = process.cwd()
const chokidar = require('chokidar')
const chalk = require('chalk')
const { spawn } = require('child_process')
const { existsSync } = require('fs')

let server

const devServer = () => {
  if (server) {
    server.kill()
  }

  const indexfile = existsSync('node_modules/boxescms/index.js') ? 'node_modules/boxescms/index.js' : 'index.js'

  const args = [indexfile]

  if (process.env.BOXES_INSPECTPORT) {
    args.unshift(`--inspect=${process.env.BOXES_INSPECTPORT}`)
  }

  server = spawn('node', args, {
    stdio: 'inherit'
  })
}

module.exports = () => {
  console.log(chalk.blue('Watching Server ') + chalk.yellow('[server/**]'))

  devServer()

  const watcher = chokidar.watch([
    'server/**'
  ], {
    cwd: base
  })

  watcher.on('change', () => {
    console.log(`Restarting ${chalk.yellow('Server')}`)

    devServer()
  })

  return watcher
}
