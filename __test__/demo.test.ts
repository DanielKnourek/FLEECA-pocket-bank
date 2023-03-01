import { Config } from 'jest'

describe('Demo tests', () => {
    it('test: is equal', () => {
        let equation: Number = 5 * 5 - 25;
        expect(equation).toEqual(0);
    })
})