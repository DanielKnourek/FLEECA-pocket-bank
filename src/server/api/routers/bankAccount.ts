import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "@/server/api/trpc";
import { BankAccountIdentifierSchema, newBankAccountSchema } from "@/types/bankAccount";
import { createBankAccount, deleteEmptyAccount, getBankAccountPublicInformation, getOwnerBankAccounts } from "@/utils/bankAccount/bankAccount";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const bankAccountRouter = createTRPCRouter({
    createAccount: protectedProcedure
        .input(newBankAccountSchema.omit({ owner_id: true, balance: true, }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session.userAccount) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Problem while authorizing session." });
            }
            const result = await createBankAccount({ ...input, balance: 0, owner_id: ctx.session.userAccount.id });

            if (!result.success) {
                console.error(result.error);
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "could not create this account" });
            }
            return result;
        }),

    listOwnerBankAccounts: protectedProcedure
        .query(async ({ ctx }) => {
            if (!ctx.session.userAccount) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Problem while authorizing session." });
            }
            const result = await getOwnerBankAccounts(ctx.session.userAccount.id);
            return result;
        }),
    
    getBankAccountPublicInformation: publicProcedure
    .input(z.object({bankAccount_id: z.string()}))
    .query(async ({input}) => {
        const result = await getBankAccountPublicInformation(input.bankAccount_id);

        if(!result) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "This account doesnt exists" });
        }

        return {
            id: result.id,
            currency_code: result.currency_code
        }
    }),

    deleteEmptyAccount: protectedProcedure
        .input(BankAccountIdentifierSchema)
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session.userAccount) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Problem while authorizing session." });
            }

            const result = await deleteEmptyAccount({
                bankAccount_id: input.id, 
                owner_id: ctx.session.userAccount.id
            })

            if (!result.success) {
                console.error(result.error);
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "could not delete this account" });
            }
            return result;
        })
});

export { bankAccountRouter };
