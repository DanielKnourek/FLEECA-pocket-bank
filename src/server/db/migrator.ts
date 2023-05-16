import * as path from 'path'
import { promises as fs } from 'fs'
import { Pool } from 'pg'
import {
  Migrator,
  FileMigrationProvider,
  Kysely,
  PostgresDialect,
} from 'kysely'
import * as dotenv from 'dotenv';
import { createKysely } from '@vercel/postgres-kysely';

dotenv.config();

async function migrateToLatest() {
  console.log('Starting a migrator!');
  console.log('process.env.POSTGRES_URL', process.env.POSTGRES_URL);

  const db = createKysely();
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  })

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

export default migrateToLatest();