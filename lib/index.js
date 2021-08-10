const createConnector = require("./connector")
const createPoolConnector = require("./pool")

const version = "0.10.8"

const DbRiver = {
  version,
  createConnector,
  createPoolConnector,
}

module.exports = DbRiver
