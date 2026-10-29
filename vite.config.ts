import type { UserConfig } from "vite";
import { defineConfig } from "vite";

// oxlint-disable-next-line import/no-default-export
export default defineConfig(({ mode, command }): UserConfig => {
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
            outDir: "out",
            target: "es2020",
            sourcemap: true,
            emptyOutDir: false,
        },
    };
});
