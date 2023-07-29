const pg = require("pg");
require("dotenv").config();

const painLogSql = `CREATE TABLE IF NOT EXISTS "pain_log" (
  "id" SERIAL,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Los_Angeles'),
  "severity" INTEGER NOT NULL,
  PRIMARY KEY ("id")
);`;

const painNotesSql = `CREATE TABLE IF NOT EXISTS "pain_notes" (
  "id" SERIAL,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Los_Angeles'),
  "note" TEXT NOT NULL,
  PRIMARY KEY ("id")
);`;

// Run table creation scripts

async function run() {
  const connectionString = process.env.POSTGRES_CONNECTION_STRING;
  const client = new pg.Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await client.connect();

  await client.query(painLogSql);
  await client.query(painNotesSql);

  await client.end();
}

run();
