import "@testing-library/jest-dom";
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, screen } from "@testing-library/react";
import Home from '@/pages/index';
import { api } from "@/utils/api";
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { mock } from 'jest-mock-extended';
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import trpc from '@/pages/api/trpc/[trpc]';

describe('Test index page', () => {
    const server = setupServer(
        rest.get('/api/trpc/example.hello', (req, res, ctx) => {
            return res(ctx.json({ greeting: 'hello there' }))
        }),
    )

    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())
    

    it('should contain key elements', () => {
        render(<Home />);
        expect(screen.getByTestId('h-t3app')).toBeInTheDocument();
        expect(screen.getByTestId('h-t3app')).toBeVisible();
    })
})