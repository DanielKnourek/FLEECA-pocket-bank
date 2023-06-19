import { Database } from "@/server/db/db-schema";
import { listAccountTransactionHistoryType, newATMTransactionClientType, newTransactionClientType } from "@/types/transaction";
import { InsertQueryBuilder, InsertResult, Insertable, Selectable, UpdateQueryBuilder, UpdateResult } from "kysely";
import { getBankAccountPublicInformation, getOwnerBankAccounts } from "./bankAccount";
import { calculateExchangeRate } from "../exchangeRate";
import { db, useDB } from "@/server/db";
import { BankAccountIdentifierSchema, BankAccountIdentifierType } from "@/types/bankAccount";


interface processATMTransactionParams {
    transaction: newATMTransactionClientType,
    owner_id: Selectable<Database['UserAccount']>['id']
}

const processATMTransaction = async ({ owner_id, transaction }: processATMTransactionParams) => {
    const [senderAccounts] = await Promise.all([
        getOwnerBankAccounts(owner_id),
    ])

    const reciverAccount = findBankAccount({ senderAccounts, sender_account_id: transaction.receiver_account_id })
    if (!reciverAccount) {
        return {
            success: false,
            // TODO error message
            error: Error('cannot find account')
        } as processTransactionResponseError;
    }

    const successful = canTransactionSuccess({
        sender: reciverAccount,
        convertedPayment: {
            source_amount: -transaction.receiver_payment_ammount,
            target_amount: -transaction.receiver_payment_ammount,
            source_currency_code: transaction.receiver_account_id,
            target_currency_code: reciverAccount.currency_code
        }
    })

    if (!successful) {
        // TODO format error message
        throw Error("BAD_REQUEST");
    }

    const processedTransaction = performTransactions({
        transactions: [{
            success: successful,
            transaction: {
                receiver_payment_ammount: transaction.receiver_payment_ammount,
                receiver_account_id: transaction.receiver_account_id,
                successful,
                sender_payment_ammount: transaction.receiver_payment_ammount,
                sender_account_id: '00000000-0000-0000-0000-000000000000',
            }
        }],
        sender_id: '11111111-1111-1111-1111-111111111111',
    })

    return await processedTransaction;
}

interface processTransactionBatchParams {
    transactions: newTransactionClientType[],
    owner_id: Selectable<Database['UserAccount']>['id']
}

/**
 * 
 */
const processTransactionBatch = async ({ owner_id, transactions }: processTransactionBatchParams) => {
    const receiver_account_id = transactions[0]?.receiver_account_id;

    // is receiver_account_id set and same in whole batch ?
    if (!receiver_account_id || !transactions.every((transaction => receiver_account_id == transaction.receiver_account_id))) {
        // TODO format error message
        throw Error("BAD_REQUEST");
    }

    const [senderAccounts, reciever] = await Promise.all([
        getOwnerBankAccounts(owner_id),
        getBankAccountPublicInformation(receiver_account_id)]
    )

    const promisedTransactions: ReturnType<typeof processTransaction>[] = [];
    for (const transaction of transactions) {
        promisedTransactions.push(processTransaction({ transaction, reciever, senderAccounts }))
    }
    const processedTransactions = await Promise.all(promisedTransactions);

    if (!processedTransactions.every(transaction => transaction.success && transaction.transaction.successful)) {
        // TODO format error message
        throw Error("BAD_REQUEST");
    }
    performTransactions({ transactions: processedTransactions as processTransactionResponseSuccess[], sender_id: owner_id })
    return (processedTransactions as processTransactionResponseSuccess[]);
}

interface findSenderParams {
    senderAccounts: Awaited<ReturnType<typeof getOwnerBankAccounts>>;
    sender_account_id: processTransactionBatchParams['transactions'][number]['sender_account_id'];
}
const findBankAccount = ({ senderAccounts, sender_account_id }: findSenderParams) => {
    return senderAccounts.find((account => account.id == sender_account_id));
}

interface processTransactionParams {
    senderAccounts: Awaited<ReturnType<typeof getOwnerBankAccounts>>;
    reciever: Awaited<ReturnType<typeof getBankAccountPublicInformation>>;
    transaction: processTransactionBatchParams['transactions'][number];
}

interface processTransactionResponseSuccess {
    success: true,
    transaction: Insertable<Database['TransactionLog']>,
}

interface processTransactionResponseError {
    success: false,
    error: any,
}
type processTransactionResponse = processTransactionResponseSuccess | processTransactionResponseError;

const processTransaction = async ({ reciever, senderAccounts, transaction }: processTransactionParams): Promise<processTransactionResponse> => {
    // TODO steps
    // Does reciever exists ?
    // obtain sender accounts
    // get public information of a reciver account
    // calculate exchange rate

    // Does sender have enough balance

    const sender = findBankAccount({ senderAccounts, sender_account_id: transaction.sender_account_id });
    if (!sender || !reciever) {
        return {
            success: false,
            // TODO error message
            error: Error('cannot find account')
        } as processTransactionResponseError;
    }
    let convertedPayment: Awaited<ReturnType<typeof calculateExchangeRate>>;
    if (transaction.type == 'send') {
        convertedPayment = await calculateExchangeRate({
            source_amount: transaction.sender_payment_ammount,
            source_currency_code: sender.currency_code,
            target_currency_code: reciever.currency_code,
        })
    } else {
        convertedPayment = await calculateExchangeRate({
            source_amount: transaction.receiver_payment_ammount,
            source_currency_code: reciever.currency_code,
            target_currency_code: sender.currency_code,
        })
        convertedPayment = {
            ...convertedPayment,
            source_amount: convertedPayment.target_amount,
            target_amount: convertedPayment.source_amount,
        }
    }

    const successful = canTransactionSuccess({ sender, convertedPayment });

    return {
        transaction: {
            sender_payment_ammount: convertedPayment.source_amount,
            receiver_payment_ammount: convertedPayment.target_amount,
            successful,
            sender_account_id: sender.id,
            receiver_account_id: reciever.id,
        },
        success: true,
    } as processTransactionResponseSuccess;
}

interface canTransactionSuccessParams {
    sender: processTransactionParams['senderAccounts'][number]
    convertedPayment: Awaited<ReturnType<typeof calculateExchangeRate>>
}

const canTransactionSuccess = ({ sender, convertedPayment }: canTransactionSuccessParams) => {
    let success = true;
    success = (sender.balance - convertedPayment.source_amount) > 0;

    return success
}
interface performTransactionsParams {
    transactions: processTransactionResponseSuccess[],
    sender_id: string,
}
const performTransactions = async ({ transactions, sender_id }: performTransactionsParams) => {
    const queries: Promise<InsertResult[] | UpdateResult[]>[] = [];
    const insertedValues = transactions.map(transaction => ({ ...transaction.transaction, sender_id }));
    const addTransactionRecords = useDB.insertInto('TransactionLog')
        .values(insertedValues)
        .execute()

    queries.push(addTransactionRecords);

    transactions.forEach(transaction => {
        transaction.transaction.sender_account_id &&
            queries.push(
                useDB.updateTable('BankAccount')
                    .set(({ bxp }) => ({
                        balance: bxp('BankAccount.balance', '-', transaction.transaction.sender_payment_ammount)
                    }))
                    .where('BankAccount.id', '=', transaction.transaction.sender_account_id)
                    .execute()
            )
        transaction.transaction.receiver_account_id &&
            queries.push(
                useDB.updateTable('BankAccount')
                    .set(({ bxp }) => ({
                        balance: bxp('BankAccount.balance', '+', transaction.transaction.receiver_payment_ammount)
                    }))
                    .where('BankAccount.id', '=', transaction.transaction.receiver_account_id)
                    .execute()
            )
    })

    await Promise.all(queries);
}


const listAccountTransactionHistory = async ({ id, page = 0, owner_id }: listAccountTransactionHistoryType) => {
    //TODO add check - only account memmber can see logs
    return await useDB.selectFrom('TransactionLog')
        .where(({ or, cmpr, and }) => and([
            or([
                cmpr('TransactionLog.receiver_account_id', '=', id),
                cmpr('TransactionLog.sender_account_id', '=', id),
            ])
        ]))
        .orderBy('TransactionLog.created_at', 'desc')
        .selectAll()
        .limit(10)
        .offset(page)
        .execute();
}

export { processTransactionBatch, listAccountTransactionHistory, processATMTransaction }
