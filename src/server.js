const Koa = require('koa')

const { PORT = 1337 } = process.env

const app = new Koa()

app.listen(PORT)
