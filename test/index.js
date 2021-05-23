const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

db.connect().then(async function () {
  console.log("Connected")
  const query = db.insert(
    ["test", 123, { $: "CURRENT_TIME" }, db.select("id").from("user").limit(1)],
    [new Date(), { $eId: "test2" }, null]
  )
  console.log(query.toSqlString())
  // insert values ('test',123,CURRENT_TIME,(select `id` from `user` limit 1)),('2021-05-23 20:14:15.800',`test2`,NULL,NULL)
})
