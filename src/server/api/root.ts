import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { userRouter } from "@/server/api/routers/user";
import { bankAccountRouter } from "@/server/api/routers/bankAccount";
import { exchangeRateRouter } from "@/server/api/routers/exchangeRate";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  bankAccount: bankAccountRouter,
  exchangeRate: exchangeRateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
