import { ColumnType, Generated } from "kysely";

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
    enabled: boolean,
    modified_at: ColumnType<Date, string | undefined, never>,
}

interface BankAccountTable {
    id: Generated<string>,
    owner_id: string,
    currency_code: string,
    balance: number,
    enabled: boolean,
    modified_at: ColumnType<Date, string | undefined, never>,
}

interface BankAccountMemberTable {
    member_id: string,
    bank_account_id: string,
    modified_at: ColumnType<Date, string | undefined, never>,
}

interface ExchangeRateTable {
    id: Generated<number>,
    country: string,
    currency_name: string,
    qty_ammout: number,
    price_ammout: number,
    currency_code: string,
    modified_at: ColumnType<Date, string | undefined, never>,
}

interface TransactionLogTable {
    sender_id: string,
    sender_currency_code: string,
    sender_payment_ammount: number,
    receiver_id: string,
    receiver_currency_code: string,
    receiver_payment_ammount: number,
    modified_at: ColumnType<Date, string | undefined, never>,
}