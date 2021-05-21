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
      .where({
        id: 5,
        status: {
          $in: [
            "manager",
            "it",
            db.select("name").from("statuses").where({ id: 5 }),
          ],
        },
        age: { $btw: [18, 40] },
        name: { $lk: "Stephan" },
        taskList: { $isnt: null },
        $or: {
          rate: { $gt: 3 },
          joinDate: { $lt: new Date("2021-02-15") },
        },
      })
      .toSqlString()
  )
  // select * from `user` where `id`=5 and `status` in ('manager','it',(select `name` from `statuses` where `id`=5)) and `age` between 18 and 40 and `name` like 'Stephan' and `taskList` is not NULL and (`rate`>3 and `joinDate`<'2021-02-15 02:00:00.000')
})
