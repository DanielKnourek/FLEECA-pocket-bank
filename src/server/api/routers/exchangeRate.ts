import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "@/server/api/trpc";
import { insertUser } from "@/utils/user";
import { getAllExchangeRates, getExchangeRate } from "@/utils/exchangeRate";

const exchangeRateRouter = createTRPCRouter({

    listCurrencies: publicProcedure
        .query(async ({ input }) => {
            return {
                list: await getAllExchangeRates(),
            }
        }),
        getExchangeRate: publicProcedure
            .input(z.string())
            .query(async ({ input }) => {
                return {
                    rate: await getExchangeRate(input),
                }
            })
});

export { exchangeRateRouter };