const createConnector = require("./connector")
const createPoolConnector = require("./pool")

const version = "0.9.0"

const DbRiver = {
  version,
  createConnector,
  createPoolConnector,
}

module.exports = DbRiver
