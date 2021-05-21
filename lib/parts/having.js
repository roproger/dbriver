const { parseSearchCondition } = require("../utils")

function createHavingPartConstructor() {
  this.parts.having = []
}

const havingPartPrototype = {
  having(...havingConditions) {
    for (const cond of havingConditions) {
      this.parts.having.push(parseSearchCondition(cond))
    }
    return this
  },
  _havingPartToSql() {
    return this.parts.having.length
      ? "having " + this.parts.having.join(" and ")
      : ""
  },
}

const havingPart = [createHavingPartConstructor, havingPartPrototype]

module.exports = havingPart
