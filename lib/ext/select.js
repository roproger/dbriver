const flagPart = require("../parts/flag")
const fromPart = require("../parts/from")
const groupByPart = require("../parts/groupBy")
const havingPart = require("../parts/having")
const intoPart = require("../parts/into")
const wherePart = require("../parts/where")
const { construct, concatSql, parseExpression } = require("../utils")

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
      this._intoPartToSql("afterLimit"),
      this._intoPartToSql("afterLock"),
    ])
  },
}

function createSelectConstructor(connector) {
  this.connector = connector
  this.parts = {
    select: [],
  }
}

const createSelect = construct([
  [createSelectConstructor, selectPrototype],
  flagPart,
  intoPart,
  fromPart,
  wherePart,
  groupByPart,
  havingPart,
])

const selectExtPrototype = {
  select(...selectExpressions) {
    const connector = this
    const instance = createSelect(connector)
    return instance.select(...selectExpressions)
  },
}

module.exports = selectExtPrototype
