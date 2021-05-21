const { escape } = require("mysql")

function createIntoPartConstructor() {
  this.parts.into = ""
  this.parts.intoPosition = "afterExpression"
}

const intoPartPrototype = {
  into(options) {
    if (options.intoPosition) this.parts.intoPosition = options.intoPosition
    if (options.dumpFile) {
      this.parts.into = "into dumpfile " + escape(options.dumpFile)
    } else if (options.outFile) {
      let into = "into outfile " + escape(options.outFile)
      if (options.charSet) {
        into += " character set " + options.charSet
      }
      if (options.fieldsTerminatedBy)
        into += " fields terminated by " + escape(options.fieldsTerminatedBy)
      if (options.fieldsEnclosedBy)
        into += " fields enclosed by " + escape(options.fieldsEnclosedBy)
      if (options.fieldsEscapedBy)
        into += " fields escaped by " + escape(options.fieldsEscapedBy)
      if (options.columnsTerminatedBy)
        into += " columns terminated by " + escape(options.columnsTerminatedBy)
      if (options.columnsEnclosedBy)
        into += " columns enclosed by " + escape(options.columnsEnclosedBy)
      if (options.columnsEscapedBy)
        into += " columns escaped by " + escape(options.columnsEscapedBy)
      if (options.linesStartingBy)
        into += " lines starting by " + escape(options.linesStartingBy)
      if (options.linesTerminatedBy)
        into += " lines terminated by " + escape(options.linesTerminatedBy)
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
