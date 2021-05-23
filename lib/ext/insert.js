const { construct, concatSql } = require("../utils")

function createInsertConstructor(connector) {
  this.connector = connector
  this.parts = {}
}

const insertPrototype = {
  toSqlString() {
    return concatSql(["insert"])
  },
}

const createInsert = construct([[createInsertConstructor, insertPrototype]])

const insertExtPrototype = {
  insert() {
    const connector = this
    const instance = createInsert(connector)
    return instance
  },
}

module.exports = insertExtPrototype
