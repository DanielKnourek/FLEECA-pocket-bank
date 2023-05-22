import { createKysely } from "@vercel/postgres-kysely";
// import { Database, WithSchemaConf } from "@/server/db/db";
import { Database } from "./db-schema";
import { Kysely, KyselyConfig } from "kysely";
import { env } from "@/env.mjs";

const db = createKysely<Database>();
const useDB = db.withSchema(env.POSTGRES_SCHEMA);

export { db, useDB };