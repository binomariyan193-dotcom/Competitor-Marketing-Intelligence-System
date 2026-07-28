import fs from 'fs';
import path from 'path';
import fileDir from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const __filename = fileDir.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('🚀 Starting Supabase Cloud PostgreSQL Migration...');

  // Path to migration file
  const migrationPath = path.resolve(__dirname, '../../supabase/migrations/001_initial_schema.sql');

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ ERROR: Migration file not found at ${migrationPath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(migrationPath, 'utf8');

  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

  if (dbUrl) {
    console.log('📡 Connecting directly to Supabase PostgreSQL database...');
    const client = new pg.Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log('✅ Connection established. Applying migration DDL and seed data...');
      await client.query(sqlContent);
      console.log('🎉 MIGRATION SUCCESSFUL! All tables, RLS policies, and seed data applied to Supabase.');
      await client.end();
      process.exit(0);
    } catch (err) {
      console.error('❌ Database migration error:', err.message);
      await client.end();
      process.exit(1);
    }
  } else {
    console.log('\n⚠️  DATABASE_URL environment variable is missing.');
    console.log('💡 To run automated direct migrations on Supabase Cloud PostgreSQL:');
    console.log('1. Copy your connection string from Supabase Dashboard -> Project Settings -> Database -> Connection String (URI).');
    console.log('   Example: postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres');
    console.log('2. Add DATABASE_URL=your_connection_string to server/.env');
    console.log('3. Re-run: npm run db:migrate\n');

    console.log('📋 ALTERNATIVE (Manual execution via Supabase Dashboard):');
    console.log(`Open ${migrationPath} and paste the contents into Supabase Dashboard -> SQL Editor -> Run.`);
    process.exit(0);
  }
}

runMigration();
