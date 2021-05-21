const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

db.connect().then(async function () {
  console.log("Connected")
  console.log(db.select().from("user").having({ a: "b" }).toSqlString())
  // select * from `user` having `a`='b'
})
