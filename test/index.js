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
    .select({ balance: { $: "sum(w.balance)" }, username: "u.username" })
    .from(
      { u: "user" },
      { join: { w: "wallet" }, on: { "w.user_id": "u.id", "w.asset": "USD" } }
    )
    .where({
      age: {
        $nbtw: [25, 50],
      },
      status: { $nin: ["married", "divorced"] },
      name: { $lk: "%Anderson" },
      achivement: db.select("a.achivement").from({
        a: db
          .select("achivement", { rate: { $: "a.rate * u.rate" } })
          .from({ a: "achivements" })
          .where({ status: { $eId: "u.status" } })
          .having({ rate: { $gte: 3.7 } })
          .orderBy({ rate: "desc" })
          .limit(1),
      }),
    })
    .groupBy("w.user_id")
    .orderBy({ balance: "desc" })
    .limit(10)
  console.log(query.toSqlString())
  // select sum(w.balance) `balance`,`u`.`username` `username` from `user` `u` inner join `wallet` `w` on `w`.`user_id`='u.id' and `w`.`asset`='USD' where `age` not between 25 and 50 and `status` not in ('married','divorced') and `name` like '%Anderson' and `achivement`=(select `a`.`achivement` from (select `achivement`,a.rate * u.rate `rate` from `achivements` `a` where `status`=`u`.`status` having `rate`>=3.7 order by `rate` desc limit 1) `a`) group by `w`.`user_id` order by `balance` desc limit 10
})
