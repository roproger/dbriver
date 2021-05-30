const { createPoolConnector } = require("../lib")

const pool = createPoolConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
  connectionLimit: 10,
  autoreconnect: false,
})

async function main() {
  const db = await pool.getConnection()

  console.log(db.select().from("user").where({}, { id: 5, a: 6 }).toSqlString())

  db.release()
}

main()
