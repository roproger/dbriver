const limitPart = require("../parts/limit")
const orderByPart = require("../parts/orderBy")
const {
  fetchPrototype,
  clonePrototype,
  queryPrototype,
} = require("../parts/query")
const { construct, isObject, concatSql, modifiedEscapeId } = require("../utils")

function createUnionSelectConstructor(connector) {
  this.connector = connector
  this.parts = {
    parts: [],
  }
}

function parseUnionPart(part) {
  if (Array.isArray(part))
    return `(${part.map((p) => parseUnionPart(p)).join(" union ")})`
  else if (isObject(part)) {
    if (part.toSqlString) return part.toSqlString()
    if (part.table) return `table ${modifiedEscapeId(part.table)}`
    if (part.all) {
      return `all ${parseUnionPart(part.all)}`
    }
    if (part.distinct) {
      return `distinct ${parseUnionPart(part.distinct)}`
    }
  } else return String(part)
}

const unionSelectPrototype = {
  unionSelect(...parts) {
    for (const part of parts) {
      this.parts.parts.push(parseUnionPart(part))
    }
    return this
  },
  toSqlString() {
    return concatSql([
      concatSql(this.parts.parts, " union "),
      this._orderByPartToSql(),
      this._limitPartToSql(),
    ])
  },
  count(list = [], options = {}) {
    let parts = []
    if (Array.isArray(list)) {
      for (const item of list) {
        if (isString(arg)) parts.push(modifiedEscapeId(item))
        else if (isObject(item) && item.distinct) {
          parts.push(`distinct ${modifiedEscapeId(item)}`)
        }
      }
    } else if (isObject(list)) options = list

    const query = this.clone()
    query.parts.limit = ""
    query.parts.orderBy = []

    return this.connector
      .fetch(
        `select count(${
          parts.length ? parts.join(",") : "*"
        }) a from (${query.toSqlString()}) b`,
        { ...options, one: true }
      )
      .then((r) => +r.a)
  },
}

const createUnionSelect = construct([
  [
    createUnionSelectConstructor,
    unionSelectPrototype,
    queryPrototype,
    fetchPrototype,
    clonePrototype,
  ],
  orderByPart,
  limitPart,
])

const unionSelectExtPrototype = {
  unionSelect(...parts) {
    const connector = this
    const instance = createUnionSelect(connector)
    return instance.unionSelect(...parts)
  },
}

module.exports = unionSelectExtPrototype
