// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from "@testing-library/react";
import Home from '@/pages/index';
import { withNextTRPC } from '@/vitest/decorator';

vi.mock('next-auth/react', (importOriginal) => {
    const mod = importOriginal()
    return {
        ...mod,
        useSession: () => {
            return {
                status: "unauthenticated",
                data: null,
            }
        }
    }
});

// Object.assign(global, { TextDecoder, TextEncoder });
// https://eternaldev.com/blog/testing-a-react-application-with-vitest/
describe('Test index page', () => {

    it('should contain key elements', async () => {
        render(<Home />, { wrapper: withNextTRPC });
        expect(screen.queryAllByText("First Steps")[0]).toBeDefined();
        expect(screen.getAllByTestId('h-t3app')).toBeDefined();
        expect(screen.getByTestId('h-t3app')).toHaveTextContent(/Create/);

        // expect(screen.getByText(/Loading tRPC query.../)).toBeVisible();
    })
})