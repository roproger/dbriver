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
    .insert()
    .into("test")
    .onDuplicateKeyUpdate({ a: 1 })
    .select(db.select("a").from("b"))
  console.log(query.toSqlString())
  // insert into `test` select `a` from `b` on duplicate key update `a`=1
})
