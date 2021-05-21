const { escapeId, escape } = require("mysql")

exports.isObject = (instance) => instance && typeof instance === "object"
exports.has = (object, prop) => object.hasOwnProperty(prop)
exports.isString = (value) => typeof value === "string"

exports.construct = (instances) => {
  let prototype = {}
  for (let [, ...iPrototypes] of instances) {
    prototype = Object.create(
      Object.prototype,
      Object.assign(
        {},
        Object.getOwnPropertyDescriptors(prototype),
        ...iPrototypes.map((iPrototype) =>
          Object.getOwnPropertyDescriptors(iPrototype)
        )
      )
    )
  }
  return function constructor(...args) {
    const thisInstance = Object.create(prototype)
    for (let [iConstructor] of instances) {
      iConstructor.apply(thisInstance, args)
    }
    return thisInstance
  }
}

exports.concatSql = (parts, joinSep = " ") =>
  parts.filter((part) => !!part).join(joinSep)

exports.isConstantExpression = (object, check = true) =>
  (check ? exports.isObject(object) : true) && exports.has(object, "$")
exports.isConstantEscapeValue = (object, check = true) =>
  (check ? exports.isObject(object) : true) && exports.has(object, "$e")
exports.isConstantEscapeId = (object, check = true) =>
  (check ? exports.isObject(object) : true) && exports.has(object, "$eId")
exports.isToSql = (instance, check = true) =>
  (check ? exports.isObject(instance) : true) && Boolean(instance.toSqlString)

exports.isNullish = (value) => value === undefined || value !== value /*NaN*/

exports.parseExpression = (expression) => {
  if (expression === null) return "NULL"
  if (exports.isNullish(expression)) return null

  if (exports.isObject(expression)) {
    if (exports.isConstantExpression(expression, false)) return expression.$
    if (exports.isToSql(expression, false))
      return `(${expression.toSqlString()})`
    if (exports.isConstantEscapeValue(expression, false)) {
      const { stringifyObjects, timeZone } = expression
      return escape(expression.$e, stringifyObjects, timeZone)
    }
    if (exports.isConstantEscapeId(expression, false)) {
      const { forbidQualified } = expression
      return escapeId(expression.$eId, forbidQualified)
    }

    const parts = []
    for (const [key, value] of Object.entries(expression)) {
      parts.push(`${exports.parseExpression(value)} ${escapeId(key)}`)
    }
    return parts.join(",")
  }

  if (exports.isString(expression)) expression = expression.replace(/[\`]/g, "")

  return escapeId(expression)
}
