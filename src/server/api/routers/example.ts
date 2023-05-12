import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { insertUser } from "~/utils/user";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  hello2: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      insertUser();
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});
