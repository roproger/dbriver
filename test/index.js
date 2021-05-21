const { createConnector } = require("../lib")

const db = createConnector({
  host: "localhost",
  user: "root",
  password: "qwert12345",
  database: "test",
})

db.connect().then(async function () {
  console.log("Connected")
  console.log(
    db
      .select("id")
      .into({
        outFile: "test.txt",
        charSet: "utf-8",
        linesStartingBy: "\n",
        linesTerminatedBy: "\n",
        fieldsEscapedBy: "\\",
      })
      .toSqlString()
  ) // select `id` into outfile 'test.txt' character set utf-8 fields escaped by '\\' lines starting by '\n' lines terminated by '\n'
  console.log(db.select("id").into({ dumpFile: "test.txt" }).toSqlString()) // select `id` into dumpfile 'test.txt'
  console.log(
    db
      .select("id")
      .into({ vars: ["a", "b"] })
      .toSqlString()
  ) // select `id` into @a,@b
})
