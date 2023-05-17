import { Kysely, sql } from 'kysely';
import { KyselyWithSchema } from '@/server/db/db-schema';

export async function up(db: KyselyWithSchema<any>): Promise<void> {
  // Migration code
  console.info("db.schemaName0", db.schemaName);

}

export async function down(db: KyselyWithSchema<any>): Promise<void> {
  // Migration code

}