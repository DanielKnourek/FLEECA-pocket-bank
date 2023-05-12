import nextJest from "next/jest";
import { Config } from "jest";

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig: Config = {
    // Add more setup options before each test is run
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@/server/(.*)$': '<rootDir>/src/server/$1',
    },
    collectCoverageFrom: ['./src/**'],
    coverageThreshold: {
        global: {
            functions: 90,
            lines: 80,
        }
    },
    //ignore default stack code
    coveragePathIgnorePatterns: [
        'env.mjs',
        'api/trpc.ts',
    ],
    testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)