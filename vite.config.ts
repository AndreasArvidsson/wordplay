import path from "node:path";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";

// oxlint-disable-next-line import/no-default-export
export default defineConfig((): UserConfig => {
    return {
        resolve: {
            alias: {
                "react-dom/test-utils": "preact/test-utils",
                "react-dom": "preact/compat",
                "react/jsx-dev-runtime": "preact/jsx-runtime",
                "react/jsx-runtime": "preact/jsx-runtime",
                react: "preact/compat",
            },
        },

        build: {
            outDir: path.join(import.meta.dirname, "docs"),
            target: "es2020",
            sourcemap: true,
            emptyOutDir: false,
        },
    };
});
