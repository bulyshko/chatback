const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })

module.exports = schema => (context, next) => {
  const valid = ajv.validate(schema, context.request.body)
  if (valid) {
    return next()
  } else {
    context.throw(400, {
      errors: ajv.errors.map(error => ({
        source: {
          pointer: error.dataPath.replace(/\./g, '/')
        },
        code: '4400',
        title: 'Invalid data structure',
        detail: error.message
      }))
    })
  }
}
