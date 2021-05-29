const { createPoolConnector } = require("../lib")

const pool = createPoolConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

async function main() {
  const db = await pool.getConnection()

  console.log(await db.select().from("user").fetch())

  db.release()
}

main()
