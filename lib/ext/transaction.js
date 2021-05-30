const transactionExtPrototype = {
  startTransaction(...characteristics) {
    return this.query(`start transaction ${characteristics.join(" ")}`)
  },
  commit(options = {}) {
    const { andNoChain, andChain, noRelease, release } = options
    return this.query(
      `commit${andNoChain ? " and no chain" : andChain ? " and chain" : ""}${
        noRelease ? " no release" : release ? " release" : ""
      }`
    )
  },
  rollback(options = {}) {
    const { andNoChain, andChain, noRelease, release } = options
    return this.query(
      `rollback${andNoChain ? " and no chain" : andChain ? " and chain" : ""}${
        noRelease ? " no release" : release ? " release" : ""
      }`
    )
  },
  savepoint(identifier) {
    return this.query(`savepoint ${identifier}`)
  },
  rollbackTo(identifier) {
    return this.query(`rollback to ${identifier}`)
  },
  releaseSavepoint(identifier) {
    return this.query(`release savepoint ${identifier}`)
  },
  setTransaction({ global, session, characteristics }) {
    return this.query(
      `set${
        global ? " global" : session ? " session" : ""
      } transaction${parseTransactionCharacteristics(characteristics)}`
    )
  },
}

function parseTransactionCharacteristics(characteristics = []) {
  return characteristics
    .map((c) =>
      c.isolationLevel
        ? " isolation level " + c.isolationLevel
        : c.access
        ? " " + c.access
        : ""
    )
    .join("")
}

module.exports = transactionExtPrototype
