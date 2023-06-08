import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { newTransactionClientSchema } from "@/types/transaction";
import { getBankAccountPublicInformation } from "@/utils/bankAccount/bankAccount";
import { processTransactionBatch } from "@/utils/bankAccount/transaction";
import { calculateExchangeRate } from "@/utils/exchangeRate";
import { TRPCError } from "@trpc/server";

const transactionRouter = createTRPCRouter({
    processTransaction: protectedProcedure
        .input(newTransactionClientSchema)
        .mutation(async ({ input, ctx }) => {
            if (!ctx.session.userAccount) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Problem while authorizing session." });
            }
            const result = await processTransactionBatch({ owner_id: ctx.session.userAccount.id, transactions: [input], })
                .catch(error => {
                    throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Cannot complete transaction." });
                });
            // console.log("result", result);

            return "Success"
        })
});

export { transactionRouter };
