const { construct } = require("../utils")

function createUnionSelectConstructor(connector) {
  this.connector = connector
  this.parts = {}
}

const unionSelectPrototype = {
  unionSelect(...parts) {
    return this
  },
}

const createUnionSelect = construct([
  [createUnionSelectConstructor, unionSelectPrototype],
])

const unionSelectExtPrototype = {
  unionSelect(...parts) {
    const connector = this
    const instance = createUnionSelect(connector)
    return instance.unionSelect(...parts)
  },
}

module.exports = unionSelectExtPrototype
