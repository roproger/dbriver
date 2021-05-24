const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

db.connect().then(async function () {
  console.log("Connected")
  const query = db
    .update("test")
    .set({ a: { $eId: "b" } })
    .set({ c: 1 })
    .where({ id: 5 })
  console.log(query.toSqlString())
  // update `test` set `a`=`b`,`c`=1 where `id`=5
})
