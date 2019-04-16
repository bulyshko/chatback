const { createLogger, format, transports: { Console, File } } = require('winston')
const { combine, timestamp, label, printf, colorize, align, splat } = format

const logsFormat = printf(info => {
  const timestamp = info.timestamp.slice(0, 19).replace('T', ' ')
  return `${timestamp} ${info.level} ${info.label}: ${info.message}`
})

module.exports = fileName => {
  const transports = [new File({
    filename: `${__dirname}/../../logs/combined.log`,
    level: 'info',
    maxsize: 5242880,
    maxFiles: 2,
    format: combine(timestamp(), align(), label({ label: fileName }), splat(), logsFormat),
  })]

  if (process.env.NODE_ENV !== 'production') {
    transports.push(new Console({
      level: 'debug',
      format: combine(colorize(), timestamp(), align(), label({ label: fileName }), splat(), logsFormat)
    }))
  }

  return createLogger({ transports })
}
