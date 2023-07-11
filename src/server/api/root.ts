import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "@/server/api/routers/user";
import { bankAccountRouter } from "@/server/api/routers/bankAccount";
import { exchangeRateRouter } from "@/server/api/routers/exchangeRate";
import { transactionRouter } from "@/server/api/routers/transaction";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  bankAccount: bankAccountRouter,
  exchangeRate: exchangeRateRouter,
  transaction: transactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
