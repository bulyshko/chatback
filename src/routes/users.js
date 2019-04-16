const uuid = require('uuid')
const body = require('koa-body')
const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const { isUsernameTaken } = require('../db')

router.post('/', body(), context => {
  const { data: { id, attributes: { username } } } = context.request.body

  if (id !== undefined) {
    context.throw(403, 'Client-Generated IDs are not allowed')
  }

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
