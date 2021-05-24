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
    .delete()
    .from({ t: "test" })
    .from({ t2: "test2" })
    .using("t", { join: "t2", on: { "t2.a_id": { $eId: "t1.id" } } })
  console.log(query.toSqlString())
  // delete from `test` `t`,`test2` `t2` using `t` inner join `t2` on `t2`.`a_id`=`t1`.`id`
})
