import { Kysely, sql } from 'kysely';
import { CurrentSchema } from '../migrator';

/**
 * Adding currentExchangeRate View to automaticly find newest record for each exchange rate
 */

export async function up(db: Kysely<any>): Promise<void> {
  console.info(`Migration ${__filename} up on schema: ${CurrentSchema}`);
  // Migration code

  const currentExchangeRate = db.withSchema(CurrentSchema).selectFrom('ExchangeRate')
    .select([
      'ExchangeRate.country', 'ExchangeRate.created_at',
      'ExchangeRate.currency_code', 'ExchangeRate.currency_name',
      'ExchangeRate.price_ammout', 'ExchangeRate.qty_ammout'
    ])
    .innerJoin(
      (subquerry) => subquerry
        .selectFrom('ExchangeRate')
        .select([
          'ExchangeRate.currency_code',
          db.fn.max('created_at').as('created_at'),
        ])
        .groupBy([
          'ExchangeRate.currency_code',
        ])
        .as('currentExchangeRate_subquerry'),
      (join) => join
        .onRef('currentExchangeRate_subquerry.currency_code', '=', 'ExchangeRate.currency_code')
        .onRef('currentExchangeRate_subquerry.created_at', '=', 'ExchangeRate.created_at')
    )

  await db.schema.withSchema(CurrentSchema)
    .createView('CurrentExchangeRate')
    .columns(['country', 'created_at', 'currency_code', 'currency_name', 'price_ammout', 'qty_ammout'])
    .as(currentExchangeRate)
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  console.info(`Migration ${__filename} down on schema: ${CurrentSchema}`);
  // Migration code

  await db.schema.withSchema(CurrentSchema)
    .dropView('currentExchangeRate')
    .execute()
}