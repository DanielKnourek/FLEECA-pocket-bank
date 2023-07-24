import { Kysely, sql } from 'kysely';
import { CurrentSchema } from '../migrator';
import { useDB } from '@/server/db';

/**
 * Add a system account to make ATM transaction at
 */

export async function up(db: Kysely<any>): Promise<void> {
  console.info(`Migration ${__filename} up on schema: ${CurrentSchema}`);
  // Migration code

  await db.withSchema(CurrentSchema)
    .insertInto('UserAccount')
    .values({
      email: 'dev.danielknourek@gmail.com',
      first_name: 'SYSTEM',
      last_name: 'ATM',
      login_platform_uid: 'SYSTEM',
      id: '11111111-1111-1111-1111-111111111111',
    })
    .execute()

  await db.withSchema(CurrentSchema)
    .insertInto('BankAccount')
    .values({
      balance: 0,
      currency_code: 'CZK',
      owner_id: '11111111-1111-1111-1111-111111111111',
      id: '00000000-0000-0000-0000-000000000000',
    })
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  console.info(`Migration ${__filename} down on schema: ${CurrentSchema}`);
  // Migration code

  await db.withSchema(CurrentSchema)
    .deleteFrom('BankAccount')
    .where('BankAccount.id', '=', '00000000-0000-0000-0000-000000000000')
    .execute()

  await db.withSchema(CurrentSchema)
    .deleteFrom('UserAccount')
    .where('UserAccount.id', '=', '11111111-1111-1111-1111-111111111111')
    .execute()
}