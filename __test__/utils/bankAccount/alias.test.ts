import { env } from '@/env.mjs';
import { checkForAlias } from '@/utils/bankAccount/alias'
import { describe, it, expect } from 'vitest'

describe('bankAccount alias', () => {
    it('returns undefined on nonexisting alias', () => {
        expect(checkForAlias('abc')).toBeUndefined();
    })

    it('returns alias for ATM', () => {
        expect(env.NEXT_PUBLIC_SYSTEM_ATM_BANKACCOUNT_ID).toBeDefined();
        expect(checkForAlias(env.NEXT_PUBLIC_SYSTEM_ATM_BANKACCOUNT_ID)).toEqual('ATM');
    })

    it('handles null as Deleted account alias', () => {
        expect(checkForAlias(null as any)).toEqual('Deleted Account')

    })
})