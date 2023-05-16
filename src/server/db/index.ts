import { createKysely } from "@vercel/postgres-kysely";
import { Database } from "@/server/db/db.d";

const db = createKysely<Database>();

export { db };