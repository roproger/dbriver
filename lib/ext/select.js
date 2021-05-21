const { construct } = require("../utils")

const selectPrototype = {
  toSqlString() {},
}

function createSelectConstructor(connector) {
  this.connector = connector
  this.parts = {}
}

const createSelect = construct([[createSelectConstructor, selectPrototype]])

const selectExtPrototype = {
  select() {
    const connector = this
    const instance = createSelect(connector)
    return instance
  },
}

module.exports = selectExtPrototype
