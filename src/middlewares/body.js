const body = require('koa-body')

function notValid (value) {
  return !value || !value.includes('application/vnd.api+json')
}

module.exports = async (context, next) => {
  // all requests must include the JSON:API media type in their Accept header
  if (notValid(context.headers['accept'])) {
    context.throw(406)
  }

  // POST, PUT and PATCH requests must have valid Content-Type header
  if (/^(POST|PUT|PATCH)$/.test(context.method) && notValid(context.headers['content-type'])) {
    context.throw(415)
  } else {
    // we must patch Content-Type otherwise context.is('json') will return false
    // and koa-body middleware will not handle json request
    context.headers['content-type'] = 'application/json'
  }

  await body()(context, next)

  // set correct media type
  // https://github.com/koajs/koa/issues/1120
  if (context.type.includes('application/json')) {
    context.type = 'application/vnd.api+json'
  }
}
