const Router = require('koa-router')
const router = new Router()

router.get('/', context => context.redirect(process.env.ORIGIN))

module.exports = router
