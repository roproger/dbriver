const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

db.connect().then(async function () {
  console.log("Connected")
  const a = db.select().from("user")
  const b = a.clone()
  b.where({ id: 5 })
  console.log(a.toSqlString())
  console.log(b.toSqlString())
})
