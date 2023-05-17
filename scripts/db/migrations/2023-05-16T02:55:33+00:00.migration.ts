import { Kysely, sql } from 'kysely'
import { KyselyWithSchema } from '@/server/db/db-schema';

/**
 * Initial creation of a database
 */

export async function up(db: KyselyWithSchema<any>): Promise<void> {
  // Migration code
  console.info("db.schemaName2", db.schemaName);
  // await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.execute(db);
  await db.schema
    .createTable('UserAccount')
    .addColumn('id', 'uuid', (col) => {
      return col
        .primaryKey()
        .defaultTo(sql`gen_random_uuid()`)
    })
    .addColumn('first_name', 'varchar(25)', (col) => {
      return col
        .notNull()
    })
    .addColumn('last_name', 'varchar(25)')
    .addColumn('email', 'varchar(100)', (col) => {
      return col
        .notNull()
    })
    .addColumn('login_platform_uid', 'varchar(100)', (col) => {
      return col
        .notNull()
    })
    .addColumn('enabled', 'boolean', (col) => {
      return col
        .notNull()
        .defaultTo(true)
    })
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable('ExchangeRate')
    .addColumn('country', 'varchar(25)', (col) => {
      return col
        .notNull()
    })
    .addColumn('currency_name', 'varchar(25)', (col) => {
      return col
        .notNull()
    })
    .addColumn('qty_ammout', 'decimal', (col) => {
      return col
        .notNull()
    })
    .addColumn('price_ammout', 'decimal', (col) => {
      return col
        .notNull()
    })
    .addColumn('currency_code', 'varchar(10)', (col) => {
      return col
        .notNull()
    })
    .addColumn('created_at', 'timestamp', (col) =>
      col
        .defaultTo(sql`now()`)
        .notNull()
    )
    .addPrimaryKeyConstraint('ExchangeRate_pk', ['currency_code', 'created_at'])
    .execute();

  await db.schema
    .createTable('BankAccount')
    .addColumn('id', 'uuid', (col) => {
      return col
        .primaryKey()
        .defaultTo(sql`gen_random_uuid()`)
    })
    .addColumn('owner_id', 'uuid', (col) => {
      return col
        .references('BankAccount.id')
        .onDelete('no action')
        .notNull()
    })
    .addColumn('currency_code', 'varchar(10)', (col) => {
      return col
        .notNull()
    })
    .addColumn('balance', 'decimal', (col) => {
      return col
        .notNull()
        .defaultTo(0)
    })
    .addColumn('enabled', 'boolean', (col) => {
      return col
        .notNull()
        .defaultTo(true)
    })
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable('BankAccountMember')
    .addColumn('member_id', 'uuid', (col) => {
      return col
        .references('UserAccount.id')
        .onDelete('cascade')
        .notNull()
    })
    .addColumn('bank_account_id', 'uuid', (col) => {
      return col
        .references('BankAccount.id')
        .onDelete('cascade')
        .notNull()
    })
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addPrimaryKeyConstraint('BankAccountMember_pk', ['bank_account_id', 'member_id'])
    .execute();

  await db.schema
    .createTable('TransactionLog')
    .addColumn('id', 'serial', (col) => {
      return col
        .primaryKey()
    })
    .addColumn('sender_id', 'uuid', (col) => {
      return col
        .references('UserAccount.id')
        .onDelete('cascade')
        .notNull()
    })
    .addColumn('sender_account_id', 'uuid', (col) => {
      return col
        .references('BankAccount.id')
        .onDelete('set null')
        .notNull()
    })
    .addColumn('sender_payment_ammount', 'decimal', (col) => {
      return col
        .notNull()
    })
    .addColumn('receiver_account_id', 'uuid', (col) => {
      return col
        .references('BankAccount.id')
        .onDelete('set null')
        .notNull()
    })
    .addColumn('receiver_payment_ammount', 'decimal', (col) => {
      return col
        .notNull()
    })
    .addColumn('successful', 'boolean', (col) => {
      return col
        .notNull()
    })
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code

  await db.schema.dropTable('TransactionLog').execute();
  await db.schema.dropTable('BankAccountMember').execute();
  await db.schema.dropTable('ExchangeRate').execute();
  await db.schema.dropTable('BankAccount').execute();
  await db.schema.dropTable('UserAccount').execute();
}