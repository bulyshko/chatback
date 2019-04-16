const users = []

function isUsernameTaken (username) {
  return users.includes(username)
}

function takeUsername (username) {
  users.push(username)
}

function releaseUsername (username) {
  users.splice(users.indexOf(username), 1)
}

module.exports = { isUsernameTaken, takeUsername, releaseUsername }
