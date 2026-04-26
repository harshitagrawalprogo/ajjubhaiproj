import { sql } from "./server/db.js";

(async () => {
  console.log("Testing Neon DB connection...");
  try {
    const rows = await sql`SELECT 1 AS test, NOW() AS server_time`;
    console.log("✅ Neon DB connection successful!");
    console.log("   Result:", rows[0]);
    process.exit(0);
  } catch (error) {
    console.error("❌ Neon DB connection FAILED!");
    console.error("   Error:", error.message);
    if (error.code) console.error("   Code:", error.code);
    process.exit(1);
  }
})();
