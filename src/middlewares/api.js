const { STATUS_CODES } = require('http')

function notValid (value) {
  return !value || !value.includes('application/vnd.api+json')
}

module.exports = async (context, next) => {
  try {
    // all requests must include the JSON:API media type in their Accept header
    if (notValid(context.headers['accept'])) {
      context.throw(406)
    }

    // POST, PUT and PATCH requests must have valid Content-Type header
    if (/^(POST|PUT|PATCH)$/.test(context.method) && notValid(context.headers['content-type'])) {
      context.throw(415)
    }

    // we must patch Content-Type otherwise context.is('json') will return false
    // and koa-body middleware will not handle json request
    context.headers['content-type'] = 'application/json'

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

  // set correct media type
  // https://github.com/koajs/koa/issues/1120
  context.type = 'application/vnd.api+json'
}
