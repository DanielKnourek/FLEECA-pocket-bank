import { ColumnType, Generated } from "kysely";
import { Kysely, KyselyConfig } from 'kysely'
export interface Database {
    UserAccount: UserAccountTable,
    BankAccount: BankAccountTable,
    BankAccountMember: BankAccountMemberTable,
    ExchangeRate: ExchangeRateTable,
    TransactionLog: TransactionLogTable,
}

interface UserAccountTable {
    id: Generated<string>,
    first_name: string,
    last_name: string | null,
    email: string,
    login_platform_uid: string,
    enabled: Generated<boolean>,
    created_at: ColumnType<Date, string | undefined, never>,
}

interface ExchangeRateTable {
    country: string,
    currency_name: string,
    qty_ammout: number,
    price_ammout: number,
    currency_code: string,
    created_at: ColumnType<Date, string | undefined, never>,
}

interface BankAccountTable {
    id: Generated<string>,
    owner_id: UserAccountTable['id'],
    currency_code: ExchangeRateTable['currency_code'],
    balance: number,
    enabled: Generated<boolean>,
    created_at: ColumnType<Date, string | undefined, never>,
}

interface BankAccountMemberTable {
    member_id: UserAccountTable['id'],
    bank_account_id: BankAccountTable['id'],
    created_at: ColumnType<Date, string | undefined, never>,
}

interface TransactionLogTable {
    id: Generated<number>,
    sender_id: UserAccountTable['id'],
    sender_account_id: BankAccountTable['id'],
    sender_payment_ammount: number,
    receiver_account_id: BankAccountTable['id'],
    receiver_payment_ammount: number,
    successful: boolean,
    created_at: ColumnType<Date, string | undefined, never>,
}

interface WithSchemaConf extends KyselyConfig {
    schemaName: string
}

class KyselyWithSchema<DB = any> extends Kysely<DB> {
    constructor(args: WithSchemaConf) {
        super(args);
        this.schemaName = args.schemaName;
    }
    public schemaName: string | undefined;
}

export {KyselyWithSchema}