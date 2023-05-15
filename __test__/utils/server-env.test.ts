import { describe, it, expect } from 'vitest';
import { env } from '@/env.mjs';

describe("test server env access", () => {

    it("server env is acessible", () => {
        expect(env.NEXT_PUBLIC_CLIENT_CODENAME).toBeDefined();
        expect(env.NODE_ENV).toBeDefined();
    });
});