const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

db.connect().then(async function () {
  console.log("Connected")
  const query = db.update("test").update({ join: "test2" })
  console.log(query.toSqlString())
  // update `test` inner join `test2`
})
