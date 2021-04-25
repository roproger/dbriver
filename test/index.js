const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
})

db.connect().then(() => {
  console.log("Connected")
})
