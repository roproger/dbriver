const { parseTableReferences } = require("../utils")

function createFromPartConstructor() {
  this.parts.from = ""
}

const fromPartPrototype = {
  from(...tableReferences) {
    this.parts.from = parseTableReferences(this.parts.from, ...tableReferences)
    return this
  },
  _fromPartToSql() {
    return this.parts.from ? "from " + this.parts.from : null
  },
}

const fromPart = [createFromPartConstructor, fromPartPrototype]

module.exports = fromPart
