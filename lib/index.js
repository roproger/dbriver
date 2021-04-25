const mysql = require("mysql")
const { isObject, has } = require("./utils")

const version = "0.0.5"

const connectorPrototype = {
  connect() {
    // close previous connection if exists
    this.close()

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

  close(immideately = false) {
    if (this.current) {
      if (immideately) return this.current.destroy()
      return this.current.end()
    }
  },

  destroy() {
    this.close(true)
    this.options = null
    this.current = null
  },

  query(sql, values, options = {}) {
    if (isObject(values)) options = values

    if (this.current === null)
      throw new Error("Current connection is empty, call `connect` method")
    return new Promise((resolve, reject) => {
      this.current.query(
        {
          sql,
          values,
          ...options,
        },
        (err, results, fields) => {
          if (err) {
            if (err.code === "PROTOCOL_CONNECTION_LOST") {
              this.connect()
                .then(() => this.query(sql, values, options))
                .then(resolve)
                .catch(reject)
            } else if (err.fatal) {
              this.connect().finally(() => reject(err))
            } else reject(err)
          } else resolve({ results, fields })
        }
      )
    })
  },

  fetch(sql, values, options = {}) {
    if (isObject(values)) options = values
    return this.query(sql, values, options).then(({ results }) =>
      Number.isInteger(options.index)
        ? results[options.index]
        : options.one
        ? results[0]
        : results
    )
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
