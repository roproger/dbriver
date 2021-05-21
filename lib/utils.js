exports.isObject = (instance) => instance && typeof instance === "object"
exports.has = (object, prop) => object.hasOwnProperty(prop)

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
