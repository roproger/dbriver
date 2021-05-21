const { parseSearchCondition } = require("../utils")

function createWherePartConstructor() {
  this.parts.where = []
}

const wherePartPrototype = {
  where(...whereConditions) {
    for (const cond of whereConditions) {
      this.parts.where.push(parseSearchCondition(cond))
    }
    return this
  },
  _wherePartToSql() {
    return this.parts.where.length
      ? "where " + this.parts.where.join(" and ")
      : ""
  },
}

const wherePart = [createWherePartConstructor, wherePartPrototype]

module.exports = wherePart
