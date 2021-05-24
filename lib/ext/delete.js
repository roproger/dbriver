const { escapeId } = require("mysql")
const flagPart = require("../parts/flag")
const { construct, concatSql, isObject } = require("../utils")

function createDeleteConstructor(connector) {
  this.connector = connector
  this.parts = {
    from: [],
  }
}

const deletePrototype = {
  from(...tableNames) {
    for (const name of tableNames) {
      if (isObject(name)) {
        for (const [alias, tbl] of Object.entries(name)) {
          this.parts.from.push(`${escapeId(tbl)} ${escapeId(alias)}`)
        }
      } else this.parts.from.push(escapeId(name))
    }
    return this
  },
  toSqlString() {
    return concatSql([
      "delete",
      this._flagPartToSql(),
      "from",
      this.parts.from.join(","),
    ])
  },
}

const createDelete = construct([
  [createDeleteConstructor, deletePrototype],
  flagPart,
])

const deleteExtPrototype = {
  delete() {
    const connector = this
    const instance = createDelete(connector)
    return instance
  },
}

module.exports = deleteExtPrototype
