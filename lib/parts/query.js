const { isObject } = require("../utils")

const queryPrototype = {
  query(values, options) {
    return this.connector.query(this.toSqlString(), values, options)
  },
}

const fetchPrototype = {
  fetch(values, options) {
    return this.connector.fetch(this.toSqlString(), values, options)
  },
}

function cloneParts(parts) {
  const clonedParts = {}
  for (const [key, value] of Object.entries(parts)) {
    if (Array.isArray(value)) clonedParts[key] = [...value]
    else if (value instanceof Set) clonedParts[key] = new Set([...value])
    else if (isObject(value) && value.clone) clonedParts[key] = value.clone()
    else clonedParts[key] = value
  }
  return clonedParts
}
const clonePrototype = {
  clone() {
    const prototype = Object.getPrototypeOf(this)
    const instance = Object.create(prototype)

    instance.connector = this.connector
    instance.parts = cloneParts(this.parts)

    return instance
  },
}

module.exports = { queryPrototype, fetchPrototype, clonePrototype }
