const mysql = require("mysql")

const version = "0.0.1"

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
  instance.options = options
  instance.current = null

  return instance
}

const DbRiver = {
  version,
  createConnector,
}

module.exports = DbRiver
