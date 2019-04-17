const uuid = require('uuid')
const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const body = require('../middlewares/body')
const validate = require('../middlewares/validate')(require('../../docs/schemas/user'))
const router = new Router({ prefix: '/users' })
const { isUsernameTaken } = require('../db')

const {
  SECRET_KEY,
  TOKEN_TTL = 24 * 60 * 60 * 1000 // 1 day
} = process.env

router.post('/', body, validate, context => {
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
        username,
        token: jwt.sign({ username }, SECRET_KEY, { expiresIn: TOKEN_TTL })
      }
    }
  }
})

module.exports = router
