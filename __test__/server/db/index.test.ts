import { db } from '@/server/db'
import { QueryResult } from 'kysely'
import { fixtureUserAccount } from 'scripts/db/fixtures/db-schema';
import { describe, it, expect } from 'vitest'
import { DeepMockProxy, mockDeep } from 'vitest-mock-extended';

describe('Validate db querry builder', () => {

    it('select from {UserAccount}', async () => {
        const fixtureResult: QueryResult<typeof fixtureUserAccount> = {
            rows: [
                fixtureUserAccount
            ],
        }
        const compiledQuerry = db.selectFrom('UserAccount').selectAll().compile();
        expect(compiledQuerry).toBeTruthy();

        const mockDB: DeepMockProxy<typeof db> = mockDeep<typeof db>({ funcPropSupport: true });
        mockDB.executeQuery.calledWith(compiledQuerry).mockReturnValue(Promise.resolve(fixtureResult));
        const executedResult = (await mockDB.executeQuery(compiledQuerry)) as QueryResult<typeof fixtureUserAccount>;

        expect(executedResult.rows.length).toBeGreaterThan(0);
        expect(executedResult.rows[0]?.email).eq(fixtureUserAccount.email);
    })
})