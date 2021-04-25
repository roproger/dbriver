const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

db.connect().then(async function () {
  console.log("Connected")
  await db.changeUser({
    user: "root2",
    password: "qwert12345",
  })
  console.log(await db.fetch("select * from `user`", { one: true }))
})
