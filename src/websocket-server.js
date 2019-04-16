const WebSocket = require('ws')

module.exports = server => {
  const wss = new WebSocket.Server({ server })

  wss.on('connection', (client, req) => {
    client.on('message', message => {
    })
    client.on('close', code => {
    })
  })

  return wss
}
