const { parseExpression, parseTableReferences } = require("../utils")

function createFromPartConstructor() {
  this.parts.from = ""
}

const fromPartPrototype = {
  from(...tableReferences) {
    this.parts.from = parseTableReferences(...tableReferences)
    return this
  },
  _fromPartToSql() {
    return "from " + this.parts.from
  },
}

const fromPart = [createFromPartConstructor, fromPartPrototype]

module.exports = fromPart
