const { construct, concatSql } = require("../utils")

function createUpdateConstructor(connector) {
  this.connector = connector
  this.parts = {}
}

const updatePrototype = {
  toSqlString() {
    return concatSql(["update"])
  },
}

const createUpdate = construct([[createUpdateConstructor, updatePrototype]])

const updateExtPrototype = {
  update() {
    const connector = this
    const instance = createUpdate(connector)
    return instance
  },
}

module.exports = updateExtPrototype
