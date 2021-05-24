const { escapeId } = require("mysql")
const flagPart = require("../parts/flag")
const fromPart = require("../parts/from")
const groupByPart = require("../parts/groupBy")
const havingPart = require("../parts/having")
const intoPart = require("../parts/into")
const limitPart = require("../parts/limit")
const lockPart = require("../parts/lock")
const orderByPart = require("../parts/orderBy")
const {
  queryPrototype,
  fetchPrototype,
  clonePrototype,
} = require("../parts/query")
const wherePart = require("../parts/where")
const {
  construct,
  concatSql,
  parseExpression,
  isString,
  isObject,
} = require("../utils")

const selectPrototype = {
  select(...selectExpressions) {
    for (const expression of selectExpressions) {
      this.parts.select.push(parseExpression(expression))
    }
    return this
  },
  toSqlString() {
    return concatSql([
      "select",
      this._flagPartToSql(),
      this.parts.select.length ? concatSql(this.parts.select, ",") : "*",
      this._intoPartToSql("afterExpression"),
      this._fromPartToSql(),
      this._wherePartToSql(),
      this._groupByPartToSql(),
      this._havingPartToSql(),
      this._orderByPartToSql(),
      this._limitPartToSql(),
      this._intoPartToSql("afterLimit"),
      this._lockPartToSql(),
      this._intoPartToSql("afterLock"),
    ])
  },
  count(list = [], options = {}) {
    let parts = []
    if (Array.isArray(list)) {
      for (const item of list) {
        if (isString(arg)) parts.push(escapeId(item))
        else if (isObject(item) && item.distinct) {
          parts.push(`distinct ${escapeId(item)}`)
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

function createSelectConstructor(connector) {
  this.connector = connector
  this.parts = {
    select: [],
  }
}

const createSelect = construct([
  [
    createSelectConstructor,
    selectPrototype,
    queryPrototype,
    fetchPrototype,
    clonePrototype,
  ],
  flagPart,
  intoPart,
  fromPart,
  wherePart,
  groupByPart,
  havingPart,
  orderByPart,
  limitPart,
  lockPart,
])

const selectExtPrototype = {
  select(...selectExpressions) {
    const connector = this
    const instance = createSelect(connector)
    return instance.select(...selectExpressions)
  },
}

module.exports = selectExtPrototype
