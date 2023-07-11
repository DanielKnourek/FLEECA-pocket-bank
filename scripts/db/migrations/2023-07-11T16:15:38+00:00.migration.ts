import { Kysely, sql } from 'kysely';
import { CurrentSchema } from '../migrator';

/**
 * Droping not null contriant for account id at transaction log table to allow deleting accounts
 */

export async function up(db: Kysely<any>): Promise<void> {
  console.info(`Migration ${__filename} up on schema: ${CurrentSchema}`);
  // Migration code

  await db.schema.withSchema(CurrentSchema)
    .alterTable('TransactionLog')
    .alterColumn('receiver_account_id', (col) => {
      return col.dropNotNull()
    })
    .alterColumn('sender_account_id', (col) => {
      return col.dropNotNull()
    })
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  console.info(`Migration ${__filename} down on schema: ${CurrentSchema}`);
  // Migration code

  await db.schema.withSchema(CurrentSchema)
    .alterTable('TransactionLog')
    .alterColumn('receiver_account_id', (col) => {
      return col.setNotNull()
    })
    .alterColumn('sender_account_id', (col) => {
      return col.setNotNull()
    })
    .execute()
}