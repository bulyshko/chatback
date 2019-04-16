const { STATUS_CODES } = require('http')

module.exports = async (context, next) => {
  try {
    await next()

    // response.status is set to 404 by default
    if (context.status === 404) {
      context.throw(404)
    }
  } catch (error) {
    const { status, message, stack, headers, errors } = error

    context.app.emit('error', error, context)

    if (Array.isArray(headers)) {
      context.set(headers)
    }

    const code = context.status = typeof status === 'number' ? status : 500
    const dev = context.app.env === 'development'

    context.body = {
      errors: Array.isArray(errors) ? errors : [
        {
          status: '' + code,
          title: dev ? message : STATUS_CODES[code],
          detail: dev ? stack : undefined
        }
      ]
    }
  }
}
