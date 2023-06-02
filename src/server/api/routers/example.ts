import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { insertUser } from "@/utils/user";
import { getAllExchangeRates, getExchangeRate } from "@/utils/exchangeRate";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  hello2: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      await insertUser();
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getExchangeRate: publicProcedure
    .query(async ({ input }) => {
      return {
        money: await getAllExchangeRates(),
        // money: await getExchangeRate("EUR"),
        // money: await DowloadAndParseDSV()
      }
    })
});
