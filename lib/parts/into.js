const { escape } = require("mysql")
const { isObject, has } = require("../utils")

const e = (value) =>
  isObject(value) && has(value, "toString") ? String(value) : escape(value)

function createIntoPartConstructor() {
  this.parts.into = ""
  this.parts.intoPosition = "afterExpression"
}

const intoPartPrototype = {
  into(options) {
    if (options.position) this.parts.intoPosition = options.position
    if (options.dumpFile) {
      this.parts.into = "into dumpfile " + e(options.dumpFile)
    } else if (options.outFile) {
      let into = "into outfile " + e(options.outFile)
      if (options.charSet) {
        into += " character set " + options.charSet
      }
      if (options.fieldsTerminatedBy)
        into += " fields terminated by " + e(options.fieldsTerminatedBy)
      if (options.fieldsEnclosedBy)
        into += " fields enclosed by " + e(options.fieldsEnclosedBy)
      if (options.fieldsEscapedBy)
        into += " fields escaped by " + e(options.fieldsEscapedBy)
      if (options.columnsTerminatedBy)
        into += " columns terminated by " + e(options.columnsTerminatedBy)
      if (options.columnsEnclosedBy)
        into += " columns enclosed by " + e(options.columnsEnclosedBy)
      if (options.columnsEscapedBy)
        into += " columns escaped by " + e(options.columnsEscapedBy)
      if (options.linesStartingBy)
        into += " lines starting by " + e(options.linesStartingBy)
      if (options.linesTerminatedBy)
        into += " lines terminated by " + esceape(options.linesTerminatedBy)
      this.parts.into = into
    } else if (options.vars) {
      this.parts.into = "into " + options.vars.map((o) => `@${o}`).join(",")
    }
    return this
  },
  _intoPartToSql(position) {
    if (position === this.parts.intoPosition) {
      return this.parts.into
    }
    return ""
  },
}

const intoPart = [createIntoPartConstructor, intoPartPrototype]

module.exports = intoPart
