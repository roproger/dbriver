const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

db.connect().then(async function () {
  console.log("Connected")
  const clone = db.clone()

  clone.connect().then(function () {
    db.fetch("select id from user").then((results) => {
      console.log("db", results)
      console.log("db thread", db.threadId)
    })
    clone.fetch("select id from user").then((results) => {
      console.log("clone", results)
      console.log("clone thread", clone.threadId)
    })
  })
})
