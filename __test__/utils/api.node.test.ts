// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { api, getBaseUrl, tRPCconfig } from '@/utils/api';
import { boolean } from 'zod';

describe('verify existence of a tRPC router', () => {
    it('{api} is defined', () => {
        expect(api).toBeDefined();
        expect(api.withTRPC).toBeDefined();
        expect(api.useQueries).toBeDefined();
    });

    it('', () => {
        expect(tRPCconfig.config().links).toBeDefined();
        expect(tRPCconfig.config().transformer).toBeDefined();
    })
});

describe('helper function is valid in node', () => {
    const orginalEnv = process.env;
    const { window: originalWindow } = global;

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...orginalEnv };
    })

    afterEach(() => {
        process.env = orginalEnv;
        global.window = originalWindow;
    })

    it('should give vercel url when process.env.VERCEL_URL is set', () => {
        process.env.VERCEL_URL = 'example.com'
        const result = getBaseUrl();
        expect(result).toBeDefined();
        expect(result).toEqual("https://example.com");
    })

    it('should get localhost ip with defined port', () => {
        process.env.PORT = '1234';
        const result = getBaseUrl();
        expect(result).toBeDefined();
        expect(result).toEqual('http://localhost:1234');
    })

    it('should get localhost ip with default port', () => {
        delete process.env.PORT;
        const result = getBaseUrl();
        expect(result).toBeDefined();
        expect(result).toEqual('http://localhost:3000');
    })
})