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

  await db.startTransaction()
  try {
    await db
      .select({ $: "@a:=id" })
      .from("user")
      .limit(1)
      .orderBy({ id: "asc" })
      .lockFor({ mode: "update" })
      .query()
    console.log(await db.update("user").set({ fullName: "Test Test" }).query())
    await db.commit()
  } catch (e) {
    console.log(e)
    await db.rollback()
  }

  db.release()
}

main()
