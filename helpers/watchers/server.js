const base = process.cwd()
const chokidar = require('chokidar')
const chalk = require('chalk')
const {spawn} = require('child_process')

let server

const devServer = () => {
  if (server) {
    server.kill()
  }

  server = spawn('node', ['index.js'], {
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
