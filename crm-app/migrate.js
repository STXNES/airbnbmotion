const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);
const CSV_PATH = path.join(__dirname, '..', '02-MASTER_DATABASE', 'master_database.csv');

function inferCountry(city = '', state = '') {
  const c = city.toLowerCase();
  const s = state.toLowerCase();

  if (c.includes('tamarindo') || c.includes('manuel antonio') || c.includes('nosara') || 
      c.includes('santa teresa') || c.includes('papagayo') || c.includes('jaco') || 
      c.includes('escazu') || c.includes('dominical') || c.includes('las catalinas') || 
      s.includes('puntarenas') || s.includes('guanacaste') || s.includes('san jose')) {
    return 'Costa Rica';
  }

  if (c.includes('cancun') || c.includes('playa del carmen') || c.includes('tulum') || 
      c.includes('cabos') || c.includes('vallarta') || c.includes('san miguel') || 
      s.includes('quintana roo') || s.includes('jalisco') || s.includes('baja california')) {
    return 'México';
  }

  if (c.includes('madrid') || c.includes('barcelona') || c.includes('marbella') || 
      c.includes('mallorca') || c.includes('ibiza') || s.includes('madrid') || 
      s.includes('cataluña') || s.includes('malaga') || s.includes('baleares')) {
    return 'España';
  }

  if (c.includes('punta cana') || s.includes('la altagracia')) return 'República Dominicana';
  if (c.includes('panama')) return 'Panamá';
  if (c.includes('medellin') || c.includes('cartagena') || s.includes('antioquia') || s.includes('bolivar')) return 'Colombia';
  if (c.includes('whistler') || c.includes('vancouver') || s.includes('bc') || s.includes('ontario')) return 'Canada';

  return 'United States';
}

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
        country VARCHAR(100) DEFAULT 'United States',
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
    await sql`ALTER TABLE prospects ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'United States'`;
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
            const country = row.Country || inferCountry(row.City, row.State);
            // Upsert logic based on email
            await sql`
              INSERT INTO prospects (
                company, website, email, city, state, country, first_added, 
                batch, last_sent, last_status, reply_status, reply_date, client, notes
              ) VALUES (
                ${row.Company || ''}, ${row.Website || ''}, ${row.Email || ''}, 
                ${row.City || ''}, ${row.State || ''}, ${country}, ${row.First_Added || ''}, 
                ${row.Batch || ''}, ${row.Last_Sent || ''}, ${row.Last_Status || ''}, 
                ${row.Reply_Status || ''}, ${row.Reply_Date || ''}, ${row.Client || ''}, 
                ${row.Notes || ''}
              )
              ON CONFLICT (email) DO UPDATE SET
                city = EXCLUDED.city,
                state = EXCLUDED.state,
                country = EXCLUDED.country,
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

        // Clean up existing records with wrong defaults
        console.log("🧹 Running country cleanup for existing records...");
        await sql`UPDATE prospects SET country = 'Costa Rica' WHERE state ILIKE '%Puntarenas%' OR state ILIKE '%Guanacaste%' OR city ILIKE '%Santa Teresa%' OR city ILIKE '%Papagayo%' OR city ILIKE '%Tamarindo%' OR city ILIKE '%Jaco%' OR city ILIKE '%Nosara%' OR city ILIKE '%Escazu%'`;
        await sql`UPDATE prospects SET country = 'México' WHERE state ILIKE '%Quintana Roo%' OR city ILIKE '%Cancun%' OR city ILIKE '%Tulum%' OR city ILIKE '%Playa del Carmen%' OR city ILIKE '%Los Cabos%' OR city ILIKE '%Puerto Vallarta%'`;
        await sql`UPDATE prospects SET country = 'España' WHERE state ILIKE '%Málaga%' OR state ILIKE '%Cataluña%' OR city ILIKE '%Madrid%' OR city ILIKE '%Barcelona%' OR city ILIKE '%Marbella%' OR city ILIKE '%Mallorca%' OR city ILIKE '%Ibiza%'`;
        await sql`UPDATE prospects SET country = 'Canada' WHERE state ILIKE '%BC%' OR city ILIKE '%Whistler%' OR city ILIKE '%Vancouver%'`;

        console.log(`🎉 Migration complete! Successfully uploaded ${count} rows to Vercel Postgres / Neon.`);
      });
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

migrate();
