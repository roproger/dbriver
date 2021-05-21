const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

db.connect().then(async function () {
  console.log("Connected")
  const query = db.select().flag("test").flag("test2")
  query.flag("test", false)
  console.log(query.toSqlString())
})
