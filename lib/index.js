const mysql = require("mysql")
const { isObject, has } = require("./utils")

const version = "0.0.2"

const connectorPrototype = {
  connect() {
    const connection = mysql.createConnection({
      ...this.options,
    })
    this.current = connection

    return new Promise(function (resolve, reject) {
      connection.connect(function (err) {
        if (err) reject(err)
        else resolve(connection)
      })
    })
  },
}

function createConnector(options) {
  const instance = Object.create(connectorPrototype)

  // check options
  if (!isObject(options)) throw new Error("Options parameter is not an object")
  if (!has(options, "host")) throw new Error("Host option is required")
  if (!has(options, "user")) throw new Error("User option is required")
  if (!has(options, "password")) throw new Error("Password option is required")

  instance.options = options
  instance.current = null

  return instance
}

const DbRiver = {
  version,
  createConnector,
}

module.exports = DbRiver
