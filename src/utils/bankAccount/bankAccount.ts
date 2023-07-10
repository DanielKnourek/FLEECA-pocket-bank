import { db, useDB } from "@/server/db";
import { Database } from "@/server/db/db-schema";
import { newBankAccountType } from "@/types/bankAccount";
import { DeleteResult, InsertResult, Insertable, Selectable } from "kysely";

const ATMBankAccountID = '00000000-0000-0000-0000-000000000000';

interface createBankAccountResponseSuccess {
    success: true,
    userData: InsertResult,
}
interface createBankAccountResponseError {
    success: false,
    error: any,
}
type createUserResponse = createBankAccountResponseSuccess | createBankAccountResponseError;

const createBankAccount = async (newBankAccount: newBankAccountType): Promise<createUserResponse> => {
    try {
        const { id, owner_id } = await useDB.insertInto('BankAccount')
            .values(newBankAccount)
            .returning(['BankAccount.id', 'BankAccount.owner_id'])
            .executeTakeFirstOrThrow();

        return await useDB.insertInto('BankAccountMember')
            .values({
                bank_account_id: id,
                member_id: owner_id
            })
            .executeTakeFirstOrThrow()
            .then(res => {
                return {
                    success: true,
                    userData: res,
                } as createBankAccountResponseSuccess
            })
            .catch(err => {
                return {
                    success: false,
                    error: err,
                } as createBankAccountResponseError;
            });

    } catch (error) {
        return {
            success: false,
            error: error,
        } as createBankAccountResponseError;
    }
}

const getOwnerBankAccounts = async (owner_id: Selectable<Database['BankAccountMember']>['member_id']) => {
    return await useDB.selectFrom('BankAccountMember')
        .innerJoin('BankAccount as owner_bankAccounts',
            (join) => join
                .onRef('BankAccountMember.bank_account_id', '=', 'owner_bankAccounts.id')
                .on('BankAccountMember.member_id', '=', owner_id)
        )
        .innerJoin('CurrentExchangeRate',
            (join) => join
                .onRef('CurrentExchangeRate.currency_code', '=', 'owner_bankAccounts.currency_code')
        )
        .selectAll()
        .execute();
    //TODO change selectAll to enumerate all fields
    // 'member_id', 'bank_account_id', 'created_at', 'id', 'owner_id', 'currency_code', 'balance', 'enabled', 'country', 'currency_name', 'price_ammout', 'qty_ammout'
}

const getBankAccountPublicInformation = async (bankAccount_id: Selectable<Database['BankAccountMember']>['bank_account_id']) => {
    return await useDB.selectFrom('BankAccount')
        .select(['BankAccount.currency_code', 'BankAccount.enabled', 'BankAccount.id', 'BankAccount.owner_id'])
        .where('BankAccount.id', '=', bankAccount_id)
        .executeTakeFirst();
}

interface deleteEmptyAccountResponseSuccess {
    success: true,
    userData: DeleteResult,
}
interface deleteEmptyAccountResponseError {
    success: false,
    error: any,
}
type deleteEmptyAccountResponse = deleteEmptyAccountResponseSuccess | deleteEmptyAccountResponseError;

interface deleteEmptyAccountParams {
    owner_id: Selectable<Database['BankAccount']>['owner_id'],
    bankAccount_id: Selectable<Database['BankAccount']>['id'],
}
const deleteEmptyAccount = async ({ bankAccount_id, owner_id }: deleteEmptyAccountParams): Promise<deleteEmptyAccountResponse> => {
    return await useDB.deleteFrom('BankAccount')
        .where('BankAccount.id', '=', bankAccount_id)
        .where('BankAccount.owner_id', '=', owner_id)
        .where('BankAccount.balance', '=', 0)
        .executeTakeFirstOrThrow()
        .then(res => {
            return {
                success: true,
                userData: res,
            } as deleteEmptyAccountResponseSuccess
        })
        .catch(err => {
            return {
                success: false,
                error: err,
            } as deleteEmptyAccountResponseError;
        });
}

export { ATMBankAccountID, createBankAccount, getOwnerBankAccounts, deleteEmptyAccount, getBankAccountPublicInformation };