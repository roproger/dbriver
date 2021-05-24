const { construct, concatSql } = require("../utils")

function createDeleteConstructor(connector) {
  this.connector = connector
  this.parts = {}
}

const deletePrototype = {
  toSqlString() {
    return concatSql(["delete"])
  },
}

const createDelete = construct([[createDeleteConstructor, deletePrototype]])

const deleteExtPrototype = {
  delete() {
    const connector = this
    const instance = createDelete(connector)
    return instance
  },
}

module.exports = deleteExtPrototype
