function createLimitPartConstructor() {
  this.parts.limit = ""
}

const limitPartPrototype = {
  limit(offset, length) {
    if (Number.isInteger(offset)) {
      if (Number.isInteger(length)) {
        if (length >= 1 && offset >= 0) this.parts.limit = `${offset},${length}`
      } else if (offset >= 1) this.parts.limit = String(offset)
    }
    return this
  },
  _limitPartToSql() {
    return this.parts.limit ? `limit ${this.parts.limit}` : ""
  },
}

const limitPart = [createLimitPartConstructor, limitPartPrototype]

module.exports = limitPart
