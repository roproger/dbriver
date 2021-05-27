const { escapeId } = require("mysql")
const limitPart = require("../parts/limit")
const orderByPart = require("../parts/orderBy")
const {
  fetchPrototype,
  clonePrototype,
  queryPrototype,
} = require("../parts/query")
const { construct, isObject, concatSql } = require("../utils")

function createUnionSelectConstructor(connector) {
  this.connector = connector
  this.parts = {
    disableLimitSecondParameter: true,
    parts: [],
  }
}

function parseUnionPart(part) {
  if (Array.isArray(part))
    return `(${part.map((p) => parseUnionPart(p)).join(" union ")})`
  else if (isObject(part)) {
    if (part.toSqlString) return part.toSqlString()
    if (part.table) return `table ${escapeId(part.table)}`
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
    return concatSql(this.parts.parts, " union ")
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
