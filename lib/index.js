const createConnector = require("./connector")
const createPoolConnector = require("./pool")

const version = "0.9.1"

const DbRiver = {
  version,
  createConnector,
  createPoolConnector,
}

module.exports = DbRiver
