const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const { isUsernameTaken } = require('../db')

router.post('/', context => {
  const username = '' // TODO

  if (isUsernameTaken(username)) {
    context.throw(409, 'Username already taken')
  }

  context.status = 201
  context.body = {
    data: {
      type: 'users',
      id: '', // TODO
      attributes: {
        username
      }
    }
  }
})

module.exports = router
