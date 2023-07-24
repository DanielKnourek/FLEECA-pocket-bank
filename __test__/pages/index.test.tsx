// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from "@testing-library/react";
import Home from '@/pages/index';
import { withNextTRPC } from '@/vitest/decorator';
import mockRouter from 'next-router-mock';

vi.mock('next/router', () => require('next-router-mock'));

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

// https://eternaldev.com/blog/testing-a-react-application-with-vitest/
describe('Test index page', () => {

    it('should contain key elements', async () => {
        render(<Home />, { wrapper: withNextTRPC });

        expect(screen.getByTestId('btn-home-signin')).toHaveTextContent('SignIn');
        expect(screen.getByTestId('text-index-name')).toHaveTextContent('FLEECA pocket bank');
    })

    it('has working navbar', () => {
        render(<Home />, { wrapper: withNextTRPC });

        expect(screen.getByTestId('nav-Home')).toHaveTextContent('Home');
        expect(screen.getByTestId('nav-Home').getAttribute('href')).toBe('/');

        expect(screen.getByTestId('nav-Account')).toHaveTextContent('Account');
        expect(screen.getByTestId('nav-Account').getAttribute('href')).toBe('/account');

        expect(screen.getByTestId('nav-ATM')).toHaveTextContent('ATM');
        expect(screen.getByTestId('nav-ATM').getAttribute('href')).toBe('/account/atm');
    })
})