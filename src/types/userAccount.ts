import { Database } from "@/server/db/db-schema";
import { Insertable } from "kysely";
import { toZod } from "tozod";
import { z } from "zod";

const newUserSchema: toZod<Omit<Insertable<Database["UserAccount"]>, 'id' | 'enabled' | 'created_at'>> = z.object({
    email: z.string().email().max(100),
    first_name: z.string().min(1).max(25),
    last_name: z.string().max(25).optional(),
    login_platform_uid: z.string().max(100),
})

type newUserType = z.infer<typeof newUserSchema>;

export type { newUserType };
export { newUserSchema };