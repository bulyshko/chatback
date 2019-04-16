const Router = require('koa-router')
const router = new Router({ prefix: '/users' })

router.get('/', context => {
  context.body = {
    data: []
  }
})

module.exports = router
