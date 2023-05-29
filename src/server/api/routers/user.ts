import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "@/server/api/trpc";
import { createUser } from "@/utils/userAccount/user";
import { newUserSchema } from "@/types/userAccount";

const userRouter = createTRPCRouter({

    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
    registerUser: publicProcedure
        .input(newUserSchema)
        .mutation(async ({ input }) => {
            const result = await createUser(input);
            return result;
        })
});

export { userRouter, newUserSchema };
