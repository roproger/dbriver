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
      .from(
        { u: "user" },
        {
          join: { w: "wallet" },
          on: { "w.user_id": { $eId: "u.id" }, "w.balance": { $gte: 1000 } },
        },
        { join: "test", prefix: "cross" },
        { join: "test2", using: ["a", "b", "c"] },
        "test3"
      )
      .toSqlString()
  ) // select * from `user` `u` inner join `wallet` `w` on `w`.`user_id`=`u`.`id` and `w`.`balance`>=1000 cross join `test` inner join `test2` using (`a`,`b`,`c`),`test3`
})
