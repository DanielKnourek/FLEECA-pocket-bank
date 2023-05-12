import { createClient, db, sql } from "@vercel/postgres";
import { z } from "zod";


const insertUser = async () => {
    // const SQLenvSchema = z.object({
    //     POSTGRES_DATABASE: z.string()
    // });
    const client = createClient();
    await client.connect();
    
    const KeyMatcher = z.string().startsWith("POSTGRES").catch(() => {
        return "null"
    })
    const SQLenvSchema = z.record(KeyMatcher, z.string())
    // const SQLenvSchema = z.record(z.string(), z.string())
    // SQLenvSchema.parse({
    //     AA: "stringdata",
    //     AAB: "stringdata",
    //     B: "stringdata",
    //     BBB: "stringdata",
    // });

    console.log("################ DB test! #########################");
    console.log(`env: ${JSON.stringify(SQLenvSchema.parse(process.env), null, "\t")}`);
    const result = await sql`INSERT INTO users (name, surname) VALUES ('Pan', 'Nar')`;
    console.log(result);
}

export { insertUser };