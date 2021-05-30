const flagPart = require("../parts/flag")
const limitPart = require("../parts/limit")
const orderByPart = require("../parts/orderBy")
const { queryPrototype, clonePrototype } = require("../parts/query")
const wherePart = require("../parts/where")
const {
  construct,
  concatSql,
  isObject,
  parseTableReferences,
  modifiedEscapeId,
} = require("../utils")

function createDeleteConstructor(connector) {
  this.connector = connector
  this.parts = {
    from: [],
    using: "",
    disableLimitSecondParameter: true,
  }
}

const deletePrototype = {
  from(...tableNames) {
    for (const name of tableNames) {
      if (isObject(name)) {
        for (const [alias, tbl] of Object.entries(name)) {
          this.parts.from.push(
            `${modifiedEscapeId(tbl)} ${modifiedEscapeId(alias)}`
          )
        }
      } else this.parts.from.push(modifiedEscapeId(name))
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
      this._wherePartToSql(),
      this._orderByPartToSql(),
      this._limitPartToSql(),
    ])
  },
}

const createDelete = construct([
  [
    createDeleteConstructor,
    deletePrototype,
    queryPrototype,
    clonePrototype,
    fetchPrototype,
  ],
  flagPart,
  wherePart,
  orderByPart,
  limitPart,
])

const deleteExtPrototype = {
  delete() {
    const connector = this
    const instance = createDelete(connector)
    return instance
  },
}

module.exports = deleteExtPrototype
