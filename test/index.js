const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

const query = db.cache(({ col, id }) =>
  db.select(col).from("user").where({ id })
)

db.connect().then(async function () {
  console.log("Connected")

  console.log(query.toSqlString())
  // select * from `a` union all select * from `b` union (select * from `c` union select 1) union table `test`
})
