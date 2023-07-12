import type { Database } from "@/server/db/db-schema";
import type { Insertable } from "kysely";
import type { toZod } from "tozod";

import { z } from "zod";
import { BankAccountIdentifierSchema } from "./bankAccount";

const MAX_TRANSACTION = 1_000_000_000;

const newTransactionSchema: toZod<Required<Omit<Insertable<Database["TransactionLog"]>, 'id' | 'created_at' | 'successful'>>> = z.object({
    sender_id: z.string(),
    sender_account_id: z.string().uuid(),
    sender_payment_ammount: z.number().max(MAX_TRANSACTION).min(0),
    receiver_account_id: z.string().uuid(),
    receiver_payment_ammount: z.number().max(MAX_TRANSACTION).min(0),
})

type newTransactionType = z.infer<typeof newTransactionSchema>;

const newTransactionClientSchema = z.union([
    newTransactionSchema.pick({
        sender_account_id: true,
        receiver_account_id: true,
        sender_payment_ammount: true,
    }).extend({ type: z.literal('send') }),
    newTransactionSchema.pick({
        sender_account_id: true,
        receiver_account_id: true,
        receiver_payment_ammount: true,
    }).extend({ type: z.literal('pay') }),
])

type newTransactionClientType = z.infer<typeof newTransactionClientSchema>;


const newATMTransactionClientSchema = z.union([
    newTransactionSchema.pick({
        receiver_account_id: true,
        receiver_payment_ammount: true,
    }).extend({
        type: z.literal('deposit'),
        receiver_payment_ammount: z.number().max(MAX_TRANSACTION).min(-MAX_TRANSACTION),
    }),
    newTransactionSchema.pick({
        receiver_account_id: true,
        receiver_payment_ammount: true,
    }).extend({
        type: z.literal('withdraw'),
        receiver_payment_ammount: z.number().max(MAX_TRANSACTION).min(-MAX_TRANSACTION),
    }),
])

type newATMTransactionClientType = z.infer<typeof newATMTransactionClientSchema>;


const listAccountTransactionHistorySchema = BankAccountIdentifierSchema
    .extend({
        page: z.number().optional().default(0),
        owner_id: z.string().uuid(),
    })

type listAccountTransactionHistoryType = z.infer<typeof listAccountTransactionHistorySchema>;

const listAccountTransactionHistoryClientSchema = listAccountTransactionHistorySchema
    .omit({
        owner_id: true,
    })

type listAccountTransactionHistoryClientType = z.infer<typeof listAccountTransactionHistoryClientSchema>;

export type {
    newTransactionType, newTransactionClientType,
    listAccountTransactionHistoryType, listAccountTransactionHistoryClientType,
    newATMTransactionClientType
};
export {
    newTransactionSchema, newTransactionClientSchema,
    listAccountTransactionHistorySchema, listAccountTransactionHistoryClientSchema,
    newATMTransactionClientSchema
};