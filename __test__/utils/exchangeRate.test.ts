import { env } from '@/env.mjs';
import { useDB } from '@/server/db';
import exchangeRate, { getExchangeRate} from '@/utils/exchangeRate'
import { fixtureCNBexchangeRate } from 'scripts/db/fixtures/exchangeRate';
import { describe, it, expect, vi, Mock, Mocked } from 'vitest'
import { DeepMockProxy, MockProxy, mock, mockDeep } from 'vitest-mock-extended';
import createFetchMock from 'vitest-fetch-mock';
import 'vitest-fetch-mock';

// vi.mock('@/server/db')


describe('exchangeRate', () => {
    const fetchMocker = createFetchMock(vi);

    beforeEach(() => {
        fetchMocker.resetMocks();
        fetchMocker.disableMocks();
    });

    describe('isLessThanXhours', () => {
        it('is inside interval', () => {
            const Tminus42m = new Date(Date.now() - 42 * 60 * 1000)
            expect(exchangeRate.isLessThanXhours(Tminus42m, 12)).toBe(true);
        })
        it('is not inside interval', () => {
            const Tminus42m = new Date(Date.now() - 160 * 60 * 1000)
            expect(exchangeRate.isLessThanXhours(Tminus42m, 2)).toBe(false);
        })
    })
    describe('parseFloatComma', () => {
        it('parses correctly number with "," as decimal separator', () => {
            expect(exchangeRate.parseFloatComma("156,86")).toBe(156.86);
        })
        it('parses correctly number with "." as thousands separator', () => {
            expect(exchangeRate.parseFloatComma("1.234.567,89")).toBe(1234567.89);
        })
    })

    describe('DowloadAndParseDSV', () => {

        beforeEach(() => {
            fetchMocker.enableMocks();
            fetchMocker.resetMocks();
        });

        it('CNB link is set in env', () => {
            expect(env.CNB_EXCHANGERATE_URI).toBeDefined();
            expect(env.CNB_EXCHANGERATE_URI.length).toBeGreaterThan(1);
        })
        it('is parsed succesfully', async () => {

            fetchMocker.doMock(fixtureCNBexchangeRate);

            const result = await exchangeRate.DowloadAndParseDSV();
            expect(result).toBeDefined();
            expect(result.length).toEqual(6);
            expect(result[5]?.currency_code).toBe('EUR');
            expect(result[5]?.price_ammout).toEqual(23.755)
        })

        it('returns empty array on error', async () => {

            fetchMocker.doMock("");

            const result = await exchangeRate.DowloadAndParseDSV();
            expect(result).toBeDefined();
            
            expect(result.length).toEqual(0);
        })
    })
})