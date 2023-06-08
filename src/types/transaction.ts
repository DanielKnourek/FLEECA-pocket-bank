import { Database } from "@/server/db/db-schema";
import { Insertable, Selectable } from "kysely";
import { toZod } from "tozod";
import { z } from "zod";

const MAX_TRANSACTION = 1_000_000_000;

const newTransactionSchema: toZod<Required<Omit<Insertable<Database["TransactionLog"]>, 'id' | 'created_at' | 'successful'>>> = z.object({
    sender_id: z.string(),
    sender_account_id: z.string().uuid(),
    sender_payment_ammount: z.number().max(MAX_TRANSACTION).min(0),
    receiver_account_id: z.string().uuid(),
    receiver_payment_ammount: z.number().max(MAX_TRANSACTION).min(0),
})

type newTransactionType = z.infer<typeof newTransactionSchema>;

const foo = newTransactionSchema.pick({
    sender_account_id: true,
    receiver_account_id: true,
    sender_payment_ammount: true,
}).extend({ type: z.literal('send') });

foo.extend({sender_account_id: z.string().uuid().refine((val) => val.includes('a'))})
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


export type { newTransactionType, newTransactionClientType };
export { newTransactionSchema, newTransactionClientSchema };