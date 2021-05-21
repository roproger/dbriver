const flagPart = require("../parts/flag")
const { construct, concatSql } = require("../utils")

const selectPrototype = {
  toSqlString() {
    return concatSql(["select", this._flagPartToSql()])
  },
}

function createSelectConstructor(connector) {
  this.connector = connector
  this.parts = {}
}

const createSelect = construct([
  [createSelectConstructor, selectPrototype],
  flagPart,
])

const selectExtPrototype = {
  select() {
    const connector = this
    const instance = createSelect(connector)
    return instance
  },
}

module.exports = selectExtPrototype
