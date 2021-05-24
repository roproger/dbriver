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
    .insert("(1,2,3)", { row: ["test"] })
    .cols("a", "b", "c")
    .insert({ row: { c: "test'string", a: db.select("a").from("d").limit(1) } })
    .into("table")
  console.log(query.toSqlString())
  // insert into `table` (`a`,`b`,`c`) values (1,2,3),row('test',NULL,NULL),row((select `a` from `d` limit 1),NULL,'test\'string')
})
