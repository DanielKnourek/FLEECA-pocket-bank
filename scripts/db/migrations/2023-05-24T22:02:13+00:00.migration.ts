import { Kysely, sql } from 'kysely';
import { CurrentSchema } from '../migrator';

/**
 * No duplicites users
 */

export async function up(db: Kysely<any>): Promise<void> {
  console.info(`Migration ${__filename} up on schema: ${CurrentSchema}`);
  // Migration code

  await db.schema.withSchema(CurrentSchema)
    .alterTable('UserAccount')
    .addUniqueConstraint('UserAccount_unique_email_provider_pair', ['email', 'login_platform_uid'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  console.info(`Migration ${__filename} down on schema: ${CurrentSchema}`);
  // Migration code

  await db.schema.withSchema(CurrentSchema)
    .alterTable('UserAccount')
    .dropConstraint('UserAccount_unique_email_provider_pair')
    .execute();
}