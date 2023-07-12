import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
} from "@/server/api/trpc";
import { calculateExchangeRate, getAllExchangeRates, getExchangeRate } from "@/utils/exchangeRate";
import { currencyExchangeSchema } from "@/types/exchangeRate";

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
        }),
    
    calculateExchangeRate: publicProcedure
        .input(currencyExchangeSchema)
        .query(async ({input}) => {
            const result = await calculateExchangeRate(input)
            return {
                ...result
            }
        })
});

export { exchangeRateRouter };