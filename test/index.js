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
    .insert([1, 2, 3])
    .into("test")
    .cols("a", "b", "c")
    .as("test2", ["d", "e"])
  console.log(query.toSqlString())
  // insert into `test` (`a`,`b`,`c`) values (1,2,3) as `test2` (`d`,`e`)
})
