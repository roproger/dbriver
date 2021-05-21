const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

db.connect().then(async function () {
  console.log("Connected")
  console.log(
    db
      .select()
      .from("user")
      .orderBy([1, "desc"], { test: "asc" }, "test2 desc")
      .toSqlString()
  )
  // select * from `user` order by 1 desc,`test` asc,test2 desc
})
