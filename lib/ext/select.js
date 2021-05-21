const flagPart = require("../parts/flag")
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
])

const selectExtPrototype = {
  select(...selectExpressions) {
    const connector = this
    const instance = createSelect(connector)
    return instance.select(...selectExpressions)
  },
}

module.exports = selectExtPrototype
