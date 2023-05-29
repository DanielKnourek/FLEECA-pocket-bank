import { createKysely } from "@vercel/postgres-kysely";
import { Database } from "./db-schema";
import { env } from "@/env.mjs";

const db = createKysely<Database>();
const useDB = db.withSchema(env.POSTGRES_SCHEMA);

export { db, useDB };