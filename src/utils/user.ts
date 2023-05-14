import { sql } from "@vercel/postgres";


const insertUser = async () => {

    const result = await sql`SELECT FROM information_schema.tables;`;
    // const result = await sql`INSERT INTO users (name, surname) VALUES ('Pan', 'Nar')`;
    console.log("rowcount:", result.rowCount);
}

export { insertUser };