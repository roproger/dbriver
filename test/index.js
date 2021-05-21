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
    db
      .select()
      .from("user")
      .into({
        dumpFile: "test.txt",
        position: "afterLock",
      })
      .limit(5, 10)
      .lockFor({ mode: "share", of: ["a", "b", "c"], flag: "nowait" })
      .toSqlString()
  )
  // select * from `user` limit 5,10 for share of `a`,`b`,`c` nowait into dumpfile 'test.txt'
})
