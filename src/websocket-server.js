const WebSocket = require('ws')
const { takeUsername, releaseUsername } = require('./db')

module.exports = server => {
  const wss = new WebSocket.Server({ server })

  wss.broadcast = data => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data))
      }
    })
  }

  wss.on('connection', (client, req) => {
    const username = '' // TODO

    takeUsername(username)

    wss.broadcast({ type: 'system', text: `${username} joined the chat.` })

    client.on('message', message => {
      console.info(`Received message from ${username}.`)

      wss.broadcast({ type: 'user', text: JSON.parse(message), username, timestamp: Date.now() })
    })

    client.on('close', code => {
      releaseUsername(username)

      wss.broadcast({ type: 'system', text: `${username} left the chat, connection lost.` })
    })
  })

  return wss
}
