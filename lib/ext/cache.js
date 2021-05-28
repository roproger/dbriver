const { construct } = require("../utils")

function createCacheConstructor(connector) {
  this.connector = connector
  this.parts = {
    constructor: null,
  }
}

const cachePrototype = {
  cache(constructor) {
    this.parts.constructor = constructor
  },
}

const createCache = construct([[createCacheConstructor, cachePrototype]])

const cacheExtPrototype = {
  cache(constructor) {
    const connector = this
    const instance = createCache(connector)
    return instance.cache(constructor)
  },
}

module.exports = cacheExtPrototype
