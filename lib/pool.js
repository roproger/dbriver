const { createPool } = require("mysql")
const createConnector = require("./connector")
const { construct, isObject, has } = require("./utils")

function createPoolConnectorConstructor(options) {
  const instance = this

  // check options
  if (!isObject(options)) throw new Error("Options parameter is not an object")
  if (!has(options, "host")) throw new Error("Host option is required")
  if (!has(options, "user")) throw new Error("User option is required")
  if (!has(options, "password")) throw new Error("Password option is required")

  instance.options = options
  instance.pool = createPool(options)
}

const poolConnectorPrototype = {
  getConnection() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          return reject(err)
        }
        const connector = createConnector(this.options)
        connector.current = connection
        connector.release = function () {
          connection.release()
        }
        resolve(connector)
      })
    })
  },
}

const createPoolConnector = construct([
  [createPoolConnectorConstructor, poolConnectorPrototype],
])

module.exports = createPoolConnector
