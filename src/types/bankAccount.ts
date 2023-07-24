import type { AppRouter } from "@/server/api/root";
import type { Database } from "@/server/db/db-schema";
import type { inferProcedureOutput } from "@trpc/server";
import type { Insertable, Selectable } from "kysely";
import type { toZod } from "tozod";

import { z } from "zod";

const newBankAccountSchema: toZod<Required<Omit<Insertable<Database["BankAccount"]>, 'id' | 'enabled' | 'created_at'>>> = z.object({
    currency_code: z.string(),
    owner_id: z.string().uuid(),
    balance: z.number(),
});
type newBankAccountType = z.infer<typeof newBankAccountSchema>;

const newBankAccountClientSchema = newBankAccountSchema.omit({ owner_id: true, balance: true, });
type newBankAccountClientType = z.infer<typeof newBankAccountClientSchema>;

type OwnerBankAccountListType = inferProcedureOutput<AppRouter['_def']['procedures']['bankAccount']['listOwnerBankAccounts']>;

const BankAccountIdentifierSchema: toZod<Required<Pick<Selectable<Database['BankAccount']>, 'id'>>> = z.object({
    id: z.string().uuid(),
});
type BankAccountIdentifierType = z.infer<typeof BankAccountIdentifierSchema>;

export type { newBankAccountType, newBankAccountClientType, OwnerBankAccountListType, BankAccountIdentifierType };
export { newBankAccountSchema, newBankAccountClientSchema, BankAccountIdentifierSchema };