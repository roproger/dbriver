const flagPart = require("../parts/flag")
const orderByPart = require("../parts/orderBy")
const wherePart = require("../parts/where")
const {
  construct,
  concatSql,
  parseTableReferences,
  parseAssigmentItem,
} = require("../utils")

function createUpdateConstructor(connector) {
  this.connector = connector
  this.parts = {
    refs: "",
    set: [],
  }
}

const updatePrototype = {
  update(...tableReferences) {
    this.parts.refs = parseTableReferences(this.parts.refs, ...tableReferences)
    return this
  },
  set(...assigmentList) {
    for (const item of assigmentList) {
      this.parts.set.push(parseAssigmentItem(item))
    }
    return this
  },
  toSqlString() {
    return concatSql([
      "update",
      this._flagPartToSql(),
      this.parts.refs,
      this.parts.set.length ? `set ${this.parts.set.join(",")}` : "",
      this._wherePartToSql(),
      this._orderByPartToSql(),
    ])
  },
}

const createUpdate = construct([
  [createUpdateConstructor, updatePrototype],
  flagPart,
  wherePart,
  orderByPart,
])

const updateExtPrototype = {
  update(...tableReferences) {
    const connector = this
    const instance = createUpdate(connector)
    return instance.update(...tableReferences)
  },
}

module.exports = updateExtPrototype
