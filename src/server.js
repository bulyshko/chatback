const Koa = require('koa')

const { PORT = 1337 } = process.env

const app = new Koa()

const server = app.listen(PORT)

module.exports = server

const wss = require('./websocket-server')(server)

;['SIGTERM', 'SIGINT'].forEach(event => {
  process.on(event, () => {
    console.info('%s signal received.', event)
    wss.clients.forEach(client => client.close())
    process.exit(0)
  })
})
