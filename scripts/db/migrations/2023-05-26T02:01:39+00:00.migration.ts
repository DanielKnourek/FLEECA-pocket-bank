import { Kysely, sql } from 'kysely';
import { CurrentSchema } from '../migrator';

/**
 * Fix Bank account fk contriant to point at UserAccount table.
 */

export async function up(db: Kysely<any>): Promise<void> {
  console.info(`Migration ${__filename} up on schema: ${CurrentSchema}`);
  // Migration code

  await db.schema.withSchema(CurrentSchema)
  .alterTable('BankAccount')
  .dropConstraint('BankAccount_owner_id_fkey')
  .execute();

  await db.schema.withSchema(CurrentSchema)
  .alterTable('BankAccount')
  .addForeignKeyConstraint('BankAccount_owner_id_fkey', ['owner_id'], "UserAccount", ['id'])
  .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  console.info(`Migration ${__filename} down on schema: ${CurrentSchema}`);
  // Migration code

  
  await db.schema.withSchema(CurrentSchema)
  .alterTable('BankAccount')
  .dropConstraint('BankAccount_owner_id_fkey')
  .execute();

  await db.schema.withSchema(CurrentSchema)
  .alterTable('BankAccount')
  .addForeignKeyConstraint('BankAccount_owner_id_fkey', ['owner_id'], "BankAccount", ['id'])
  .execute();
}