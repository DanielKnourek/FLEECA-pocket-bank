// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import { api, getBaseUrl } from '@/utils/api';
import { createTRPCNext } from '@trpc/next';


describe('helper function is valid in jsdom', () => {
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

    it('should give empty string when typeof window is NOT undefined', () => {
        const result = getBaseUrl();
        expect(result).toBeDefined();
        expect(typeof window).not.toBe('undefined');
        expect(result).toBe('');
    })
})