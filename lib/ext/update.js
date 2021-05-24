const flagPart = require("../parts/flag")
const { construct, concatSql, parseTableReferences } = require("../utils")

function createUpdateConstructor(connector) {
  this.connector = connector
  this.parts = {
    refs: "",
  }
}

const updatePrototype = {
  update(...tableReferences) {
    this.parts.refs = parseTableReferences(this.parts.refs, ...tableReferences)
    return this
  },
  toSqlString() {
    return concatSql(["update", this._flagPartToSql(), this.parts.refs])
  },
}

const createUpdate = construct([
  [createUpdateConstructor, updatePrototype],
  flagPart,
])

const updateExtPrototype = {
  update(...tableReferences) {
    const connector = this
    const instance = createUpdate(connector)
    return instance.update(...tableReferences)
  },
}

module.exports = updateExtPrototype
