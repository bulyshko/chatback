module.exports = (context, next) => {
  const secure = context.secure || context.headers['x-forwarded-proto'] === 'https'
  if (secure || context.app.env !== 'production') {
    return next()
  } else if (context.method === 'GET') {
    context.status = 301
    context.redirect(`https://${context.host}${context.url}`)
  } else {
    context.throw(400, 'Please use HTTPS when communicating with this server.')
  }
}
