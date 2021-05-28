const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

const query = db
  .cache(
    ["id", "col", "val", "tbl", "al", "file", "o"],
    ({ id, col, tbl, al, file, o }) =>
      db
        .select(col)
        .from({ $: `${tbl} ${al}` })
        .where({ id })
        .groupBy(col)
        .orderBy([col, o])
        .into({ dumpFile: file, position: "afterLock" })
  )
  .expand((instance, { col, val }) =>
    instance.where({ $: { left: col, op: ">", right: val } })
  )

db.connect().then(async function () {
  console.log("Connected")

  console.log(
    query.toSqlString({
      id: { $e: 5 },
      col: { $eId: "test" },
      val: { $: 10 },
      tbl: { $eId: "user" },
      al: { $eId: "u" },
      file: { $e: "test.txt" },
      o: { $: "desc" },
    })
  )
  // select `test` from `user` `u` where `id`=5 and `test`>10 group by `test` order by `test` desc into dumpfile 'test.txt'
})
