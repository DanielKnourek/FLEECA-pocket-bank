import { Database } from "@/server/db/db-schema";
import { Selectable } from "kysely";

export const fixtureUserAccount: Selectable<Database["UserAccount"]> = {
    created_at: new Date(0),
    email: "em@i.l",
    enabled: true,
    first_name: "em",
    last_name: "i",
    id: "qwertz",
    login_platform_uid: "discordoo"
}