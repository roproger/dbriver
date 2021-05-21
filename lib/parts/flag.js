function createFlagPartConstructor() {
  this.parts.flag = new Set()
}

const flagPartPrototype = {
  flag(name, show = true) {
    if (show) this.parts.flag.add(name)
    else this.parts.flag.delete(name)
    return this
  },
  _flagPartToSql() {
    return [...this.parts.flag].join(" ")
  },
}

const flagPart = [createFlagPartConstructor, flagPartPrototype]

module.exports = flagPart
