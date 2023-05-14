import { join } from "path";
import { configDefaults, defineConfig } from "vitest/config";
import react from '@vitejs/plugin-react'

export default defineConfig({
    // appType: 'custom',
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
            provider: "c8",
            reporter: ["text", "json", "html"],
            reportsDirectory: './coverage',
            include: ['src/**'],
            exclude: ['src/server/api/trpc.ts'],
            lines: 75,
            functions: 75,
        },

        exclude: [...configDefaults.exclude, "**/e2e/**"],
    },
    resolve: {
        alias: {
            "@/": join(__dirname, "./src/"),
            "@/pages/": join(__dirname, "./src/pages/"),
            "@/utils/": join(__dirname, "./src/utils/"),
            "@/server/": join(__dirname, "./src/server/"),
        },
    },
});