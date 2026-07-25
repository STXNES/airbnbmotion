const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);
const CSV_PATH = path.join(__dirname, '..', '03-MASTER_DATABASE', 'master_database.csv');

async function migrate() {
  console.log("🚀 Starting database migration to Neon...");

  try {
    // 1. Create the table
    console.log("📦 Creating 'prospects' table if it doesn't exist...");
    await sql`
      CREATE TABLE IF NOT EXISTS prospects (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255),
        website TEXT,
        email VARCHAR(255) UNIQUE,
        city VARCHAR(100),
        state VARCHAR(50),
        first_added VARCHAR(100),
        batch VARCHAR(50),
        last_sent VARCHAR(100),
        last_status VARCHAR(50),
        reply_status VARCHAR(50),
        reply_date VARCHAR(100),
        client VARCHAR(10),
        notes TEXT
      );
    `;
    console.log("✅ Table created or verified.");

    // 2. Read CSV and Insert
    const rows = [];
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on('data', (data) => rows.push(data))
      .on('end', async () => {
        console.log(`📄 Read ${rows.length} rows from CSV. Uploading to cloud...`);
        let count = 0;
        
        for (const row of rows) {
          try {
            // Upsert logic based on email
            await sql`
              INSERT INTO prospects (
                company, website, email, city, state, first_added, 
                batch, last_sent, last_status, reply_status, reply_date, client, notes
              ) VALUES (
                ${row.Company || ''}, ${row.Website || ''}, ${row.Email || ''}, 
                ${row.City || ''}, ${row.State || ''}, ${row.First_Added || ''}, 
                ${row.Batch || ''}, ${row.Last_Sent || ''}, ${row.Last_Status || ''}, 
                ${row.Reply_Status || ''}, ${row.Reply_Date || ''}, ${row.Client || ''}, 
                ${row.Notes || ''}
              )
              ON CONFLICT (email) DO UPDATE SET
                last_status = EXCLUDED.last_status,
                reply_status = EXCLUDED.reply_status,
                client = EXCLUDED.client,
                notes = EXCLUDED.notes;
            `;
            count++;
            if (count % 500 === 0) console.log(`⏳ Uploaded ${count}/${rows.length} rows...`);
          } catch (e) {
            console.log(`⚠️ Skipped duplicate or invalid email: ${row.Email}`);
          }
        }
        console.log(`🎉 Migration complete! Successfully uploaded ${count} rows to Vercel Postgres / Neon.`);
      });
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

migrate();
