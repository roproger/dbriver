const { parseSearchCondition, concatSql } = require("../utils")

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
    const where = this.parts.where.filter((w) => w != null && w !== "")
    return where.length ? "where " + where.join(" and ") : ""
  },
}

const wherePart = [createWherePartConstructor, wherePartPrototype]

module.exports = wherePart
