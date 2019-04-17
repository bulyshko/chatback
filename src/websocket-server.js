const WebSocket = require('ws')
const jwt = require('jsonwebtoken')
const url = require('url')
const uuid = require('uuid')
const { isUsernameTaken, takeUsername, releaseUsername } = require('./db')
const logger = require('./utils/logger')('websocket server')

const {
  SECRET_KEY,
  INACTIVITY_TIMEOUT = 60 * 1000 // 1 min
} = process.env

const INACTIVITY_CODE = 4001

module.exports = server => {
  const wss = new WebSocket.Server({
    server,
    verifyClient: (info, reply) => {
      const { query: { token } } = url.parse(info.req.url, true)
      if (!token) {
        logger.log('debug', 'Client verification failed: Token not found')
        reply(false, 401, 'Unauthorized')
      } else {
        jwt.verify(token, SECRET_KEY, (error, { username }) => {
          if (error) {
            logger.log('debug', 'Client verification failed: Received invalid token')
            reply(false, 401, 'Unauthorized')
          } else {
            if (isUsernameTaken(username)) {
              logger.log('debug', 'Client verification failed: Username already taken')
              reply(false, 409, 'Conflict')
            } else {
              info.req.user = username
              logger.log('debug', `Client verified: ${username}`)
              reply(true)
            }
          }
        })
      }
    }
  })

  setInterval(function () {
    const now = Date.now() - INACTIVITY_TIMEOUT
    wss.clients.forEach(client => {
      if (client.seen < now) {
        client.close(INACTIVITY_CODE)
      }
    })
  }, 1000)

  wss.broadcast = data => {
    logger.log('debug', `Broadcast: ${JSON.stringify(data)}`)
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data))
      }
    })
  }

  wss.on('connection', (client, req) => {
    const username = req.user

    takeUsername(username)

    logger.log('info', `${username} joined the chat.`)
    wss.broadcast({ type: 'system', text: `${username} joined the chat.` })

    client.seen = Date.now()

    client.on('message', message => {
      client.seen = Date.now()

      logger.log('info', `${username} sent message.`)
      wss.broadcast({ type: 'user', text: JSON.parse(message), username, timestamp: Date.now(), id: uuid() })
    })

    client.on('close', code => {
      releaseUsername(username)

      const text = code === INACTIVITY_CODE
        ? `${username} was disconnected due to inactivity.`
        : `${username} left the chat, connection lost.`

      logger.log('info', text)
      wss.broadcast({ type: 'system', text })
    })
  })

  return wss
}
