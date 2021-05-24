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
    .insert({ row: [1, 2, 3] })
    .into("test")
    .cols("a", "b", "c")
    .insert({ b: "test", c: "test" })
    .insert({ row: { a: "123", d: "123" } })
  console.log(query.toSqlString())
  // insert into `test` (`a`,`b`,`c`,`d`) values row(1,2,3,NULL),(NULL,'test','test',NULL),row('123',NULL,NULL,'123')
})
