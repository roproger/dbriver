const { isObject, parseExpression } = require("../utils")

function createOrderByPartConstructor() {
  this.parts.orderBy = []
  this.parts.orderByWithRollup = false
}

const parseOrderBy = (value) =>
  Number.isInteger(value) ? value : parseExpression(value)

const orderByPartPrototype = {
  orderBy(...args) {
    for (let arg of args) {
      if (Array.isArray(arg))
        this.parts.orderBy.push(`${parseOrderBy(arg[0])} ${arg[1]}`)
      else if (isObject(arg))
        for (const [key, value] of Object.entries(arg)) {
          this.parts.orderBy.push(`${parseExpression(key)} ${value}`)
        }
      else {
        this.parts.orderBy.push(String(arg))
      }
    }
    return this
  },
  orderByWithRollup(...args) {
    this.orderBy(...args)
    this.parts.orderByWithRollup = true
    return this
  },
  _orderByPartToSql() {
    return this.parts.orderBy.length
      ? `order by ${this.parts.orderBy.join(",")}${
          this.parts.orderByWithRollup ? " with rollup" : ""
        }`
      : ""
  },
}

const orderByPart = [createOrderByPartConstructor, orderByPartPrototype]

module.exports = orderByPart
