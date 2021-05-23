const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

db.connect().then(async function () {
  console.log("Connected")
  const query = db.insert([1, 2, 3]).into("test")
  console.log(query.toSqlString())
  // insert into `test` values (1,2,3)
})
