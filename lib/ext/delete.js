const { escapeId } = require("mysql")
const flagPart = require("../parts/flag")
const {
  construct,
  concatSql,
  isObject,
  parseTableReferences,
} = require("../utils")

function createDeleteConstructor(connector) {
  this.connector = connector
  this.parts = {
    from: [],
    using: "",
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
  using(...tableReferences) {
    this.parts.using = parseTableReferences(
      this.parts.using,
      ...tableReferences
    )
    return this
  },
  toSqlString() {
    return concatSql([
      "delete",
      this._flagPartToSql(),
      "from",
      this.parts.from.join(","),
      this.parts.using ? `using ${this.parts.using}` : "",
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
