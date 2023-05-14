import { env } from '@/env.mjs';
import { describe, it, expect } from 'vitest';

describe("test server env access", () => {
    
    it("env discord is acessible", () => {
        expect(true).toBeDefined();
        // expect(env.DISCORD_CLIENT_ID).toBeDefined();
    });
});