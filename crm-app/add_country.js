const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log("Adding country column...");
  try {
    await sql`ALTER TABLE prospects ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'United States'`;
    console.log("Success!");
  } catch (e) {
    console.error(e);
  }
}
migrate();
