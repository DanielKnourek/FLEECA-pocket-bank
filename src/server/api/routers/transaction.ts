import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { listAccountTransactionHistoryClientSchema, newATMTransactionClientSchema, newTransactionClientSchema } from "@/types/transaction";
import { listAccountTransactionHistory, processATMTransaction, processTransactionBatch } from "@/utils/bankAccount/transaction";
import { TRPCError } from "@trpc/server";

const transactionRouter = createTRPCRouter({
    processTransaction: protectedProcedure
        .input(newTransactionClientSchema)
        .mutation(async ({ input, ctx }) => {
            if (!ctx.session.userAccount) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Problem while authorizing session." });
            }
            
            await processTransactionBatch({ owner_id: ctx.session.userAccount.id, transactions: [input], })
                .catch(error => {
                    throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Cannot complete transaction." });
                });

            return "Success"
        }),
        
    processATMTransaction: protectedProcedure
    .input(newATMTransactionClientSchema)
    .mutation(async ({ input, ctx }) => {
        if (!ctx.session.userAccount) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Problem while authorizing session." });
        }

        const result = await processATMTransaction({ owner_id: ctx.session.userAccount.id, transaction: input, })
            .catch(error => {
                throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Cannot complete transaction." });
        });

        return "Success"
    }),

    listBankAccountTransactions: protectedProcedure
        .input(listAccountTransactionHistoryClientSchema)
        .query(async ({ input, ctx }) => {
            if (!ctx.session.userAccount) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Problem while authorizing session." });
            }

            const result = await listAccountTransactionHistory({ ...input, owner_id: ctx.session.userAccount.id })

            return result;
        }),
});

export { transactionRouter };
