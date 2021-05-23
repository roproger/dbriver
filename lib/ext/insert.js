const flagPart = require("../parts/flag")
const { construct, concatSql } = require("../utils")

function createInsertConstructor(connector) {
  this.connector = connector
  this.parts = {}
}

const insertPrototype = {
  toSqlString() {
    return concatSql(["insert", this._flagPartToSql()])
  },
}

const createInsert = construct([
  [createInsertConstructor, insertPrototype],
  flagPart,
])

const insertExtPrototype = {
  insert() {
    const connector = this
    const instance = createInsert(connector)
    return instance
  },
}

module.exports = insertExtPrototype
