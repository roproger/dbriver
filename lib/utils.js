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
  parts.filter((part) => part != null || part !== "").join(joinSep)

exports.isConstantExpression = (object, check = true) =>
  (check ? exports.isObject(object) : true) && exports.has(object, "$")
exports.isConstantEscapeValue = (object, check = true) =>
  (check ? exports.isObject(object) : true) && exports.has(object, "$e")
exports.isConstantEscapeId = (object, check = true) =>
  (check ? exports.isObject(object) : true) && exports.has(object, "$eId")
exports.isToSql = (instance, check = true) =>
  (check ? exports.isObject(instance) : true) && Boolean(instance.toSqlString)

exports.isNullish = (value) =>
  value === undefined || value === null || value !== value /*NaN*/

exports.parseExpression = (expression) => {
  if (exports.isNullish(expression)) return "NULL"
  if (Array.isArray(expression))
    return `(${exports.concatSql(
      value.map((v) => exports.parseExpression(v)),
      ","
    )})`
  if (exports.isObject(expression)) {
    if (exports.isConstantExpression(expression, false))
      return String(expression.$)
    if (exports.isToSql(expression, false))
      return `(${expression.toSqlString()})`
    if (exports.isConstantEscapeValue(expression, false)) {
      const { stringifyObjects, timeZone } = expression
      return escape(expression.$e, stringifyObjects, timeZone)
    }
    if (exports.isConstantEscapeId(expression, false)) {
      const { forbidQualified } = expression
      return exports.modifiedEscapeId(expression.$eId, forbidQualified)
    }

    const parts = []
    for (const [key, value] of Object.entries(expression)) {
      parts.push(
        `${exports.parseExpression(value)} ${exports.modifiedEscapeId(key)}`
      )
    }
    return exports.concatSql(parts, ",")
  }

  if (exports.isString(expression)) expression = expression.replace(/[\`]/g, "")

  return exports.modifiedEscapeId(expression)
}

exports.parseValue = (value) => {
  if (exports.isNullish(value)) return "NULL"
  if (Array.isArray(value))
    return `(${exports.concatSql(
      value.map((v) => exports.parseValue(v)),
      ","
    )})`
  if (exports.isObject(value)) {
    if (exports.isConstantExpression(value, false)) return String(value.$)
    if (exports.isToSql(value, false)) return `(${value.toSqlString()})`
    if (exports.isConstantEscapeValue(value, false)) {
      const { stringifyObjects, timeZone } = value
      return escape(value.$e, stringifyObjects, timeZone)
    }
    if (exports.isConstantEscapeId(value, false)) {
      const { forbidQualified } = value
      return exports.modifiedEscapeId(value.$eId, forbidQualified)
    }
  }

  return escape(value)
}

exports.isJoinExpression = (value) =>
  exports.isObject(value) && exports.has(value, "join")

function parseLeftRight(left, right, joinSep) {
  const parts = []
  if (Array.isArray(right))
    parts.push(...right.map((r) => parseLeftRight(left, r, joinSep)))
  else if (exports.isObject(right)) {
    if (exports.isConstantExpression(right, false))
      parts.push(`${exports.parseExpression(left)}=` + String(right.$))
    else if (exports.isToSql(right, false))
      parts.push(
        `${exports.parseExpression(left)}=` + `(${right.toSqlString()})`
      )
    else if (exports.isConstantEscapeValue(right, false)) {
      const { stringifyObjects, timeZone } = right
      parts.push(
        `${exports.parseExpression(left)}=` +
          escape(right.$e, stringifyObjects, timeZone)
      )
    } else if (exports.isConstantEscapeId(right, false)) {
      const { forbidQualified } = right
      parts.push(
        `${exports.parseExpression(left)}=` +
          exports.modifiedEscapeId(right.$eId, forbidQualified)
      )
    } else
      for (const [op, value] of Object.entries(right)) {
        if (op === "$") {
          parts.push(
            `${exports.parseExpression(left)}${value.op}${exports.parseValue(
              value
            )}`
          )
        } else if (op === "$eq") {
          parts.push(
            `${exports.parseExpression(left)}=${exports.parseValue(value)}`
          )
        } else if (op === "$neq") {
          parts.push(
            `${exports.parseExpression(left)}<>${exports.parseValue(value)}`
          )
        } else if (op === "$lt") {
          parts.push(
            `${exports.parseExpression(left)}<${exports.parseValue(value)}`
          )
        } else if (op === "$lte") {
          parts.push(
            `${exports.parseExpression(left)}<=${exports.parseValue(value)}`
          )
        } else if (op === "$gt") {
          parts.push(
            `${exports.parseExpression(left)}>${exports.parseValue(value)}`
          )
        } else if (op === "$gte") {
          parts.push(
            `${exports.parseExpression(left)}>=${exports.parseValue(value)}`
          )
        } else if (op === "$nseq") {
          parts.push(
            `${exports.parseExpression(left)}<=>${exports.parseValue(value)}`
          )
        } else if (op === "$btw") {
          parts.push(
            `${exports.parseExpression(left)} between ${exports.parseValue(
              value[0]
            )} and ${exports.parseValue(value[1])}`
          )
        } else if (op === "$nbtw") {
          parts.push(
            `${exports.parseExpression(left)} not between ${exports.parseValue(
              value[0]
            )} and ${exports.parseValue(value[1])}`
          )
        } else if (op === "$in") {
          parts.push(
            `${exports.parseExpression(left)} in ${exports.parseValue(value)}`
          )
        } else if (op === "$nin") {
          parts.push(
            `${exports.parseExpression(left)} not in ${exports.parseValue(
              value
            )}`
          )
        } else if (op === "$is") {
          parts.push(
            `${exports.parseExpression(left)} is ${
              exports.isNullish(value) ? "NULL" : value
            }`
          )
        } else if (op === "$isnt") {
          parts.push(
            `${exports.parseExpression(left)} is not ${
              exports.isNullish(value) ? "NULL" : value
            }`
          )
        } else if (op === "$lk") {
          parts.push(
            `${exports.parseExpression(left)} like ${exports.parseValue(value)}`
          )
        } else if (op === "$nlk") {
          parts.push(
            `${exports.parseExpression(left)} not like ${exports.parseValue(
              value
            )}`
          )
        }
      }
  } else
    parts.push(`${exports.parseExpression(left)}=${exports.parseValue(right)}`)
  return exports.concatSql(parts, joinSep)
}

exports.parseSearchCondition = (condition, joinSep = " and ") => {
  if (Array.isArray(condition)) {
    return `(${exports.concatSql(
      condition.map((cond) => exports.parseSearchCondition(cond)),
      joinSep
    )})`
  }
  if (exports.isString(condition)) return condition
  if (exports.isObject(condition)) {
    const parts = []
    for (const [key, value] of Object.entries(condition)) {
      if (key === "$or") {
        parts.push(
          Array.isArray(value)
            ? exports.parseSearchCondition(value, " or ")
            : exports.parseSearchCondition([value], " or ")
        )
      } else if (key === "$and") {
        parts.push(
          Array.isArray(value)
            ? exports.parseSearchCondition(value, " and ")
            : exports.parseSearchCondition([value], " and ")
        )
      } else if (key === "$xor") {
        parts.push(
          Array.isArray(value)
            ? exports.parseSearchCondition(value, " xor ")
            : exports.parseSearchCondition([value], " xor ")
        )
      } else if (key === "$") {
        parts.push(
          `${exports.parseExpression(value.left)}${
            value.op
          }${exports.parseValue(value.right)}`
        )
      } else {
        parts.push(parseLeftRight(key, value, joinSep))
      }
    }
    return exports.concatSql(parts, joinSep)
  }
}

exports.parseTableReferences = (parsed, ...refs) => {
  const coma = () => {
    if (parsed.length) parsed += ","
  }
  for (const ref of refs) {
    if (Array.isArray(ref)) {
      coma()
      parsed += `(${exports.parseTableReferences(...ref)})`
    } else if (exports.isJoinExpression(ref)) {
      parsed += ` ${ref.prefix || "inner"} join ${exports.parseExpression(
        ref.join
      )}${
        ref.on
          ? " on " + exports.parseSearchCondition(ref.on)
          : ref.using
          ? ` using (${exports.concatSql(
              ref.using.map((c) => exports.modifiedEscapeId(c)),
              ","
            )})`
          : ""
      }`
    } else {
      coma()
      parsed += exports.parseExpression(ref)
    }
  }
  return parsed
}

exports.parseAssigmentItem = (item) => {
  if (exports.isObject(item)) {
    return exports.concatSql(
      Object.entries(item).map(
        ([k, v]) => `${exports.modifiedEscapeId(k)}=${exports.parseValue(v)}`
      ),
      ","
    )
  } else return String(item)
}

exports.modifiedEscapeId = (value, forbidQualified) =>
  exports.isObject(value) && exports.has(value, "toString")
    ? String(value)
    : escapeId(value, forbidQualified)
