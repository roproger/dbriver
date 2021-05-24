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
    .update(
      { t: "test" },
      { join: { t2: "test2" }, prefix: "left", on: { "t2.a_id": "t.id" } }
    )
    .set({
      a: db.select("a").from("b").limit(1),
    })
    .orderBy([1, "asc"], [2, "desc"])
  console.log(query.toSqlString())
  // update `test` `t` left join `test2` `t2` on `t2`.`a_id`='t.id' set `a`=(select `a` from `b` limit 1) order by 1 asc,2 desc
})
