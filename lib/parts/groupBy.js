const { parseExpression } = require("../utils")

function createGroupByPartConstructor() {
  this.parts.groupBy = []
  this.parts.groupByWithRollup = false
}

const groupByPartPrototype = {
  groupBy(...args) {
    for (let arg of args) {
      if (Number.isInteger(arg)) {
        this.parts.groupBy.push(arg)
      } else this.parts.groupBy.push(parseExpression(arg))
    }
    return this
  },
  groupByWithRollup(...args) {
    this.groupBy(...args)
    this.parts.groupByWithRollup = true
    return this
  },
  _groupByPartToSql() {
    return this.parts.groupBy.length
      ? `group by ${this.parts.groupBy.join(",")}${
          this.parts.groupByWithRollup ? " with rollup" : ""
        }`
      : ""
  },
}

const groupByPart = [createGroupByPartConstructor, groupByPartPrototype]

module.exports = groupByPart
