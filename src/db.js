const users = []

function isUsernameTaken (username) {
  return users.includes(username.toLowerCase())
}

function takeUsername (username) {
  users.push(username.toLowerCase())
}

function releaseUsername (username) {
  users.splice(users.indexOf(username.toLowerCase()), 1)
}

module.exports = { isUsernameTaken, takeUsername, releaseUsername }
