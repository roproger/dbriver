const { modifiedEscapeId } = require("../utils")

function createLockPartConstructor() {
  this.parts.lockFor = false
  this.parts.lockInShare = false
}

const lockPartPrototype = {
  lockFor({ mode = "update", of = [], flag = "" }) {
    this.parts.lockFor = `for ${mode}${
      of.length ? ` of ${of.map((t) => modifiedEscapeId(t)).join(",")}` : ""
    }${flag ? ` ${flag}` : ""}`
    this.parts.lockInShare = false
    return this
  },
  lockInShare() {
    this.parts.lockFor = false
    this.parts.lockInShare = true
    return this
  },
  _lockPartToSql() {
    return this.parts.lockInShare
      ? "lock in share mode"
      : this.parts.lockFor || ""
  },
}

const lockPart = [createLockPartConstructor, lockPartPrototype]

module.exports = lockPart
