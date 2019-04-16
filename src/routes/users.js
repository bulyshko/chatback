const uuid = require('uuid')
const body = require('koa-body')
const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const { isUsernameTaken } = require('../db')

router.post('/', body(), context => {
  const { data: { attributes: { username } } } = context.request.body

  if (isUsernameTaken(username)) {
    context.throw(409, 'Username already taken')
  }

  context.status = 201
  context.body = {
    data: {
      type: 'users',
      id: uuid(),
      attributes: {
        username
      }
    }
  }
})

module.exports = router
