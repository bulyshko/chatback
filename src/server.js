const Koa = require('koa')
const favicon = require('koa-favicon')

const { PORT = 1337 } = process.env

const app = new Koa()

app.use(favicon(`${__dirname}/favicon.ico`))

app.use(require('./middlewares/ssl'))
app.use(require('./middlewares/api'))

app.on('error', ({ message }) => console.error(message))

app.use(require('./routes/users').routes())

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
