const flagPart = require("../parts/flag")
const {
  queryPrototype,
  fetchPrototype,
  clonePrototype,
} = require("../parts/query")
const {
  construct,
  concatSql,
  isString,
  parseValue,
  isObject,
  has,
  parseAssigmentItem,
  isToSql,
  modifiedEscapeId,
} = require("../utils")

function createInsertConstructor(connector) {
  this.connector = connector
  this.parts = {
    values: [],
    into: "",
    cols: new Set(),
    rowAlias: "",
    colAliases: [],
    duplicateKey: [],
    set: [],
    select: null,
    table: null,
  }
}

const parseInsertValue = (value, cols) => {
  if (Array.isArray(value)) return value.map((v) => parseValue(v))
  else if (isObject(value)) {
    if (has(value, "row")) {
      return { row: parseInsertValue(value.row, cols) }
    } else {
      for (const key of Object.keys(value)) {
        cols.add(key)
      }
      const values = []
      for (const col of cols) {
        values.push(parseValue(value[col]))
      }
      return values
    }
  } else return String(value)
}

const stringifyValue = (value, max) => {
  if (Array.isArray(value)) {
    const length = max - value.length
    if (length > 0) value = [...value, ...new Array(length).fill("NULL")]
    return `(${value.join(",")})`
  } else if (isObject(value) && has(value, "row"))
    return `row${stringifyValue(value.row, max)}`
  else return value
}

const stringifyValues = (parts) => {
  let str = ""
  if (parts.values.length) {
    const max = parts.cols.size
    str = `values ${parts.values
      .map((value) => stringifyValue(value, max))
      .join(",")}`
  }
  return str
}

const insertPrototype = {
  insert(...values) {
    for (const value of values) {
      this.parts.values.push(parseInsertValue(value, this.parts.cols))
    }
    return this
  },
  into(tblName) {
    this.parts.into = modifiedEscapeId(tblName)
    return this
  },
  cols(...cols) {
    for (const col of cols) {
      this.parts.cols.add(col)
    }
    return this
  },
  as(rowAlias, colAliases = []) {
    if (isString(rowAlias)) this.parts.rowAlias = modifiedEscapeId(rowAlias)
    if (Array.isArray(colAliases))
      this.parts.colAliases.push(
        ...colAliases.map((col) => modifiedEscapeId(col))
      )
    return this
  },
  onDuplicateKeyUpdate(...assigmentList) {
    for (const item of assigmentList) {
      this.parts.duplicateKey.push(parseAssigmentItem(item))
    }
    return this
  },
  set(...assigmentList) {
    for (const item of assigmentList) {
      this.parts.set.push(parseAssigmentItem(item))
    }
    return this
  },
  select(instance) {
    if (isToSql(instance)) this.parts.select = instance.toSqlString()
    else this.parts.select = String(instance)
    return this
  },
  table(tblName) {
    this.parts.table = `table ${modifiedEscapeId(tblName)}`
    return this
  },
  toSqlString() {
    const cols = this.parts.cols
    const colAliases = this.parts.colAliases

    return concatSql([
      "insert",
      this._flagPartToSql(),
      "into",
      this.parts.into,
      cols.size
        ? `(${[...cols].map((col) => modifiedEscapeId(col)).join(",")})`
        : "",
      stringifyValues(this.parts),
      this.parts.rowAlias ? `as ${this.parts.rowAlias}` : "",
      colAliases.length ? `(${colAliases.join(",")})` : "",
      this.parts.select,
      this.parts.table,
      this.parts.set.length ? `set ${this.parts.set.join(",")}` : "",
      this.parts.duplicateKey.length
        ? `on duplicate key update ${this.parts.duplicateKey.join(",")}`
        : "",
    ])
  },
}

const createInsert = construct([
  [
    createInsertConstructor,
    insertPrototype,
    queryPrototype,
    fetchPrototype,
    clonePrototype,
  ],
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
