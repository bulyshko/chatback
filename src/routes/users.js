const uuid = require('uuid')
const body = require('koa-body')
const Router = require('koa-router')
const validate = require('../middlewares/validate')
const router = new Router({ prefix: '/users' })
const { isUsernameTaken } = require('../db')

router.post('/', body(), validate(require('../../docs/schemas/user')), context => {
  const { data: { id, attributes: { username } } } = context.request.body

  if (id !== undefined) {
    context.throw(403, {
      errors: [
        {
          code: '4403',
          title: 'Client-Generated IDs are not allowed'
        }
      ]
    })
  }

  if (isUsernameTaken(username)) {
    context.throw(409, {
      errors: [
        {
          code: '4409',
          title: 'Username already taken'
        }
      ]
    })
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
