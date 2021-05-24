const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

db.connect().then(async function () {
  console.log("Connected")
  const query = db.delete().from({ t: "test" }).from({ t2: "test2" })
  console.log(query.toSqlString())
  // delete ignore
})
