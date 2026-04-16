import fs from "fs";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Client } = pg;
const schema = fs.readFileSync("neon_schema.sql", "utf8");
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

await client.connect();
await client.query(schema);
const tableCheck = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'members'");
const countCheck = await client.query("SELECT COUNT(*)::int AS count FROM members");
console.log(JSON.stringify({ ok: true, membersTable: tableCheck.rowCount === 1, memberCount: countCheck.rows[0].count }, null, 2));
await client.end();
