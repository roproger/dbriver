const { escapeId } = require("mysql")
const flagPart = require("../parts/flag")
const {
  construct,
  concatSql,
  isString,
  parseValue,
  isObject,
  has,
} = require("../utils")

function createInsertConstructor(connector) {
  this.connector = connector
  this.parts = {
    values: [],
    into: "",
    cols: [],
    rowAlias: "",
    colAliases: [],
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
  cols(...cols) {
    this.parts.cols.push(...cols.map((col) => escapeId(col)))
    return this
  },
  as(rowAlias, colAliases = []) {
    if (isString(rowAlias)) this.parts.rowAlias = escapeId(rowAlias)
    if (Array.isArray(colAliases))
      this.parts.colAliases.push(...colAliases.map((col) => escapeId(col)))
    return this
  },
  toSqlString() {
    const values = this.parts.values
    let valuesStr = ""
    if (values.length) {
      const max = Math.max(
        ...values.map((v) =>
          Array.isArray(v)
            ? v.length
            : isObject(v) && has(v, "row")
            ? v.row.length
            : 0
        )
      )
      valuesStr = `values ${values.map((v) =>
        Array.isArray(v)
          ? `(${[...v, ...new Array(max - v.length).fill("NULL")].join(",")})`
          : isObject(v) && has(v, "row")
          ? `row(${[
              ...v.row,
              ...new Array(max - v.row.length).fill("NULL"),
            ].join(",")})`
          : String(v)
      )}`
    }

    const cols = this.parts.cols
    const colAliases = this.parts.colAliases

    return concatSql([
      "insert",
      this._flagPartToSql(),
      "into",
      this.parts.into,
      cols.length ? `(${cols.join(",")})` : "",
      valuesStr,
      this.parts.rowAlias ? `as ${this.parts.rowAlias}` : "",
      colAliases.length ? `(${colAliases.join(",")})` : "",
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
