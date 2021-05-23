const { escapeId } = require("mysql")
const flagPart = require("../parts/flag")
const { construct, concatSql, isString, parseValue } = require("../utils")

function createInsertConstructor(connector) {
  this.connector = connector
  this.parts = {
    values: [],
    into: "",
  }
}

const insertPrototype = {
  insert(...values) {
    for (const value of values) {
      if (Array.isArray(value))
        this.parts.values.push(value.map((v) => parseValue(v)))
      else this.parts.values.push(value)
    }
    return this
  },
  into(tblName) {
    this.parts.into = escapeId(tblName)
    return this
  },
  toSqlString() {
    const values = this.parts.values
    let valuesStr = ""
    if (values.length) {
      const max = Math.max(
        ...values.map((v) => (Array.isArray(v) ? v.length : 0))
      )
      valuesStr = `values ${values.map((v) =>
        Array.isArray(v)
          ? `(${[...v, ...new Array(max - v.length).fill("NULL")].join(",")})`
          : v
      )}`
    }

    return concatSql([
      "insert",
      this._flagPartToSql(),
      "into",
      this.parts.into,
      valuesStr,
    ])
  },
}

const createInsert = construct([
  [createInsertConstructor, insertPrototype],
  flagPart,
])

const insertExtPrototype = {
  insert(...values) {
    const connector = this
    const instance = createInsert(connector)
    return instance.insert(...values)
  },
}

module.exports = insertExtPrototype
