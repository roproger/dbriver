const { clonePrototype } = require("../parts/query")
const { construct, parseValue } = require("../utils")

function createCacheConstructor(connector) {
  this.connector = connector
  this.parts = {
    instance: null,
    sql: "",
    replacers: [],
    patterns: null,
  }
}

const cachePrototype = {
  cache(replacers, constructor) {
    this.parts.replacers = [...replacers]

    const patterns = Object.fromEntries(
      replacers.map((replacer) => {
        const str = `'\`${replacer}'\``
        return [
          replacer,
          {
            $: str,
            toString() {
              return str
            },
          },
        ]
      })
    )
    this.parts.patterns = patterns

    const instance = constructor(patterns)
    this.parts.instance = instance

    this.parts.sql = instance.toSqlString()

    return this
  },
  expand(expander) {
    const instance = this.parts.instance
    expander(instance, this.parts.patterns)

    this.parts.sql = instance.toSqlString()

    return this
  },
  toSqlString(replacers = {}) {
    let sql = this.parts.sql
    const patterns = this.parts.patterns
    for (const [key, value] of Object.entries(replacers))
      sql = sql.replace(new RegExp(patterns[key], "g"), parseValue(value))
    return sql
  },
}

const createCache = construct([
  [createCacheConstructor, cachePrototype, clonePrototype],
])

const cacheExtPrototype = {
  cache(...args) {
    const connector = this
    const instance = createCache(connector)
    return instance.cache(...args)
  },
}

module.exports = cacheExtPrototype
