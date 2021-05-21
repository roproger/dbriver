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
    db.select().from("user").groupByWithRollup("name", 2).toSqlString()
  )
  // select * from `user` group by `name`,2 with rollup
})
