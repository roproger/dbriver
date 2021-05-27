const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

db.connect().then(async function () {
  console.log("Connected")
  const query = db.unionSelect(
    db.select().from("a"),
    {
      all: db.select().from("b"),
    },
    [db.select().from("c"), db.select({ $: "1" })]
  )
  console.log(query.toSqlString())
  // select * from `a` union all select * from `b` union (select * from `c` union select 1)
})
