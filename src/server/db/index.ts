import { createKysely } from "@vercel/postgres-kysely";
// import { Database, WithSchemaConf } from "@/server/db/db";
import { Database } from "./db-schema";
import { Kysely, KyselyConfig } from "kysely";

const db = createKysely<Database>();

export { db };