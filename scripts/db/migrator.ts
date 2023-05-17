import * as path from 'path'
import { promises as fs } from 'fs'
import { Pool } from 'pg'
import {
    Migrator,
    FileMigrationProvider,
    PostgresDialect,
    MigrationResultSet,
    Kysely,
} from 'kysely'
import * as dotenv from 'dotenv';
import { Database, KyselyWithSchema } from '@/server/db/db-schema';
dotenv.config();


async function migrateToLatest() {
    console.log('Starting a migrator!');
    console.log("process.env.POSTGRES_URL", process.env.POSTGRES_URL)

    const db: KyselyWithSchema = new KyselyWithSchema({
        dialect: new PostgresDialect({
            pool: new Pool({
                connectionString: process.env.POSTGRES_URL,
                ssl: true,
            }),
        }),
        schemaName: "dev"
    });

    (db as Kysely<Database>).insertInto('ExchangeRate').values({
        country: "das",
        currency_code: "SAD",
        currency_name: db.schemaName + "foo",
        price_ammout: 1,
        qty_ammout: 45.5
    }).execute();

    // interface WithSchema<DB> extends Kysely<DB> {
    //   schemaName: string
    // }

    // const db: WithSchema<unknown> = {
    //   ...(new Kysely({
    //     dialect: new PostgresDialect({
    //       pool: new Pool({
    //         connectionString: process.env.POSTGRES_URL,
    //         ssl: true,
    //       }),
    //     })
    //   })
    //   ),
    //   // schemaName: "dev",
    // }

    // const db = new Kysely({
    //   dialect: new PostgresDialect({
    //     pool: new Pool({
    //       connectionString: process.env.POSTGRES_URL,
    //       ssl: true,
    //     }),
    //   })
    // })

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            // This needs to be an absolute path.
            migrationFolder: path.join(__dirname, 'migrations'),
        }),
    })

    let error: MigrationResultSet["error"];
    let results: MigrationResultSet["results"];
    switch (parseDirection()) {
        case 'up':
            ({ error, results } = await migrator.migrateUp());
            break;
        case 'down':
            ({ error, results } = await migrator.migrateDown());
        case 'latest':
        default:
            ({ error, results } = await migrator.migrateToLatest());
            break;
    }

    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`);
        } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`);
        }
    })

    if (error) {
        console.error('failed to migrate');
        console.error(error);
        process.exit(1);
    }

    await db.destroy();
}

const parseDirection = (): 'up' | 'down' | 'latest' => {
    for (const arg of process.argv) {
        if (arg.includes('--up')) {
            return 'up';
        }
        if (arg.includes('--down')) {
            return 'down';
        }
        if (arg.includes('--latest')) {
            return 'latest';
        }
    }
    return 'latest';
}

export default migrateToLatest();