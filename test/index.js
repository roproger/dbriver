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

  console.log(
    db
      .unionSelect([db.select("a").from("b")], [db.select("a").from("c")])
      .orderBy({ id: "desc" })
      .limit(1)
      .toSqlString()
  )

  db.release()
}

main()
