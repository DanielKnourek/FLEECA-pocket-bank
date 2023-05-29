import { ColumnType, Generated } from "kysely";

interface Database {
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
    created_at: ColumnType<Date, Date | undefined, never>,
}

interface ExchangeRateTable {
    country: string,
    currency_name: string,
    qty_ammout: number,
    price_ammout: number,
    currency_code: string,
    created_at: ColumnType<Date, Date | undefined, never>,
}

interface BankAccountTable {
    id: Generated<string>,
    owner_id: UserAccountTable['id'],
    currency_code: ExchangeRateTable['currency_code'],
    balance: number,
    enabled: Generated<boolean>,
    created_at: ColumnType<Date, Date | undefined, never>,
}

interface BankAccountMemberTable {
    member_id: UserAccountTable['id'],
    bank_account_id: BankAccountTable['id'],
    created_at: ColumnType<Date, Date | undefined, never>,
}

interface TransactionLogTable {
    id: Generated<number>,
    sender_id: UserAccountTable['id'],
    sender_account_id: BankAccountTable['id'],
    sender_payment_ammount: number,
    receiver_account_id: BankAccountTable['id'],
    receiver_payment_ammount: number,
    successful: boolean,
    created_at: ColumnType<Date, Date | undefined, never>,
}

export type {
    Database
}