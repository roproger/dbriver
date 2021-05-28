const { createConnector } = require("../lib")

const pool = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})
