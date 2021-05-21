const mysql = require("mysql")
const { isObject, has, construct } = require("./utils")

function checkCurrentConnection(current) {
  if (current === null)
    throw new Error("Current connection is empty, call `connect` method")
}

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

  close(immediately = false) {
    const current = this.current
    if (current) {
      if (immediately) return current.destroy()
      return current.end()
    }
  },

  destroy() {
    this.close(true)
    this.options = null
    this.current = null
  },

  query(sql, values, options = {}) {
    if (isObject(values)) options = values

    const current = this.current

    checkCurrentConnection(current)

    return new Promise((resolve, reject) => {
      current.query(
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

  changeUser(options) {
    const current = this.current

    checkCurrentConnection(current)

    if (!isObject(options))
      throw new Error("Options parameter is not an object")
    Object.assign(this.options, options)

    return new Promise((resolve, reject) => {
      current.changeUser(options, (err) => {
        if (err) {
          if (err.code === "PROTOCOL_CONNECTION_LOST") {
            this.connect()
              .then(() => this.changeUser(options))
              .then(resolve)
              .catch(reject)
          } else if (err.fatal) {
            this.connect().finally(() => reject(err))
          } else reject(err)
        } else resolve(current)
      })
    })
  },

  pause() {
    const current = this.current
    checkCurrentConnection(current)
    current.pause()
  },

  resume() {
    const current = this.current
    checkCurrentConnection(current)
    current.resume()
  },

  get threadId() {
    const current = this.current
    if (current) return current.threadId
    return null
  },

  get state() {
    const current = this.current
    if (current) return current.state
    return null
  },

  ping() {
    const current = this.current
    checkCurrentConnection(current)
    return new Promise((resolve, reject) => {
      current.ping((err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  },

  escape(value, stringifyObjects, timeZone) {
    return mysql.escape(value, stringifyObjects, timeZone)
  },

  escapeId(id, forbidQualified) {
    return mysql.escapeId(id, forbidQualified)
  },
}

function createConnector(options) {
  const instance = this

  // check options
  if (!isObject(options)) throw new Error("Options parameter is not an object")
  if (!has(options, "host")) throw new Error("Host option is required")
  if (!has(options, "user")) throw new Error("User option is required")
  if (!has(options, "password")) throw new Error("Password option is required")

  instance.options = options
  instance.current = null
}

module.exports = construct([[createConnector, connectorPrototype]])