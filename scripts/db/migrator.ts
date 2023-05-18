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
dotenv.config();


async function migrateToLatest() {
    console.log('Starting a migrator!');

    const db = new Kysely({
        dialect: new PostgresDialect({
            pool: new Pool({
                connectionString: process.env.POSTGRES_URL,
                ssl: true,
            }),
        })
    })

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            // This needs to be an absolute path.
            migrationFolder: path.join(__dirname, 'migrations'),
        }),
        migrationTableSchema: CurrentSchema,
    })

    let error: MigrationResultSet["error"];
    let results: MigrationResultSet["results"];
    const direction = parseDirection();

    let result: MigrationResultSet;
    for (let i = 0; i < direction.count; i++) {
        switch (direction.direction) {
            case 'up':
                (result = await migrator.migrateUp());
                break;
            case 'down':
                (result = await migrator.migrateDown());
            case 'latest':
            default:
                (result = await migrator.migrateToLatest());
                break;
        }
        if (!!result.results) {
            results = results?.concat(result.results);
        }
        if (error) {
            break;
        }
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
type Direction = { direction: 'up' | 'down' | 'latest', count: number };
const parseDirection = (): Direction => {
    let result!: Direction;
    for (let argi = 0; argi < process.argv.length; argi++) {
        const arg = process.argv[argi];
        if (arg === undefined) {
            break;
        }
        if (arg.includes('--up')) {
            result = {
                count: 1,
                direction: 'up',
            };
        }
        if (arg.includes('--down')) {
            result = {
                count: 1,
                direction: 'down',
            };
        }
        if (arg.includes('--latest')) {
            result = {
                count: 1,
                direction: 'latest',
            };
        }
        if (result !== undefined) {
            let possibleCount = Number(process.argv[argi + 1]);
            result.count = Number(isNaN(possibleCount)) || possibleCount;
            return result;
        }
    }
    return {
        count: 1,
        direction: 'latest',
    };
}

const getCurrentSchema = () => {
    return process.env.POSTGRES_SCHEMA ?? 'dev';
}
const CurrentSchema = getCurrentSchema();

export default migrateToLatest();
export { CurrentSchema };