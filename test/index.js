const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

db.connect().then(async function () {
  console.log("Connected")
  const query = db.select(
    "a",
    2,
    { c: { $: "1+2" } },
    { d: db.select({ $: "1+2" }) },
    null,
    undefined,
    NaN,
    { e: null },
    "f.g",
    "test`test",
    { h: { $e: "te'st" } },
    { $eId: "i.j", forbidQualified: true }
  )
  console.log(query.toSqlString()) // select `a`,`2`,1+2 `c`,(select 1+2) `d`,NULL,NULL `e`,`f`.`g`,`testtest`,'te\'st' `h`,`i.j`
})
