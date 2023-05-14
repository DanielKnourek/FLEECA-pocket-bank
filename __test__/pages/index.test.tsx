import { describe, it, expect, vi } from 'vitest';
// import "@testing-library/jest-dom";
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from "@testing-library/react";
import Home from '@/pages/index';
import { withNextTRPC } from '@/vitest/decorator';

import client, { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
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
        // const mockSession: Omit<ReturnType<typeof useSession>, "update"> = {
        //     status: "unauthenticated",
        //     data: null,
        //   };
        // // vi.fn(() => mockSession ).mockImplementation(useSession);
        // vi.fn(() => mockSession ).mockReturnValue(useSession as any);
        // const {status} = (() => mockSession)();




        // const ctx = await createInnerTRPCContext({session: null});
        // const caller = appRouter.createCaller(ctx);
        // render(<Home />);
        render(<Home />, { wrapper: withNextTRPC });
        // render(api.withTRPC(<Home />));
        expect(screen.queryAllByText("First Steps")[0]).toBeDefined();
        expect(screen.getAllByTestId('h-t3app')).toBeDefined();
        expect(screen.getByTestId('h-t3app')).toHaveTextContent(/Create/);
    })
})