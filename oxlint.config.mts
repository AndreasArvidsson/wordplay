import { defineConfig } from "oxlint";

const disabledRules = [
    "eslint/arrow-body-style",
    "eslint/capitalized-comments",
    "eslint/complexity",
    "eslint/id-length",
    "eslint/init-declarations",
    "eslint/max-lines-per-function",
    "eslint/max-lines",
    "eslint/max-params",
    "eslint/max-statements",
    "eslint/no-await-in-loop",
    "eslint/no-console",
    "eslint/no-continue",
    "eslint/no-eq-null",
    "eslint/no-implicit-globals",
    "eslint/no-magic-numbers",
    "eslint/no-negated-condition",
    "eslint/no-plusplus",
    "eslint/no-ternary",
    "eslint/no-undefined",
    "eslint/no-use-before-define",
    "eslint/no-void",
    "eslint/one-var",
    "eslint/prefer-destructuring",
    "eslint/prefer-named-capture-group",
    "eslint/sort-imports",
    "eslint/sort-keys",
    "func-style",
    "import/exports-last",
    "import/group-exports",
    "import/max-dependencies",
    "import/no-named-export",
    "import/no-namespace",
    "import/no-nodejs-modules",
    "import/no-relative-parent-imports",
    "import/prefer-default-export",
    "node/callback-return",
    "node/no-sync",
    "node/no-top-level-await",
    "oxc/no-async-await",
    "oxc/no-optional-chaining",
    "oxc/no-rest-spread-properties",
    "promise/avoid-new",
    "promise/prefer-await-to-callbacks",
    "promise/prefer-await-to-then",
    "react-perf/jsx-no-new-function-as-prop",
    "react-perf/jsx-no-new-object-as-prop",
    "react/forbid-component-props",
    "react/jsx-max-depth",
    "react/jsx-no-literals",
    "react/no-array-index-key",
    "react/react-in-jsx-scope",
    "typescript/explicit-function-return-type",
    "typescript/no-unnecessary-type-parameters",
    "typescript/parameter-properties",
    "typescript/prefer-readonly-parameter-types",
    "typescript/promise-function-async",
    "typescript/strict-void-return",
    "unicorn/filename-case",
    "unicorn/no-array-callback-reference",
    "unicorn/no-array-for-each",
    "unicorn/no-array-reduce",
    "unicorn/no-lonely-if",
    "unicorn/no-null",
    "unicorn/prefer-at",
    "unicorn/prefer-query-selector",
    "unicorn/prefer-spread",
    "unicorn/prefer-top-level-await",
    "unicorn/switch-case-braces",
];

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
    ignorePatterns: ["node_modules", "docs"],
    options: {
        typeAware: true,
        typeCheck: true,
    },
    env: {
        browser: true,
    },
    plugins: [
        "eslint",
        "typescript",
        "unicorn",
        "oxc",
        "import",
        "promise",
        "react",
        "react-perf",
    ],
    categories: {
        correctness: "warn",
        suspicious: "warn",
        pedantic: "warn",
        perf: "warn",
        style: "warn",
        restriction: "warn",
        nursery: "warn",
    },
    globals: {
        Base64: "readonly",
    },

    rules: {
        ...Object.fromEntries(disabledRules.map((r) => [r, "off"])),
        "eslint/eqeqeq": [
            "warn",
            "always",
            {
                null: "never",
            },
        ],
        "eslint/no-duplicate-imports": [
            "warn",
            {
                allowSeparateTypeImports: true,
            },
        ],
        "eslint/no-restricted-imports": [
            "warn",
            {
                paths: [
                    {
                        name: "node:assert",
                        message: "Use node:assert/strict instead",
                    },
                ],
            },
        ],
        "eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
                destructuredArrayIgnorePattern: "^_",
                varsIgnorePattern: "^_",
            },
        ],
        "no-restricted-imports": [
            "error",
            {
                patterns: [
                    {
                        group: ["**/node/**"],
                        message:
                            "Only files in src/node may import from src/node.",
                    },
                ],
            },
        ],
        "react/jsx-filename-extension": [
            "warn",
            { extensions: [".jsx", ".tsx"] },
        ],
        "typescript/no-confusing-void-expression": [
            "warn",
            {
                ignoreArrowShorthand: true,
            },
        ],
    },

    overrides: [
        {
            // Wildcard ambient module declarations need a script file.
            files: ["src/text.d.ts"],
            rules: {
                "import/unambiguous": "off",
            },
        },
        {
            files: ["scripts/**/*.js"],
            plugins: ["eslint", "unicorn", "oxc", "import", "promise"],
            env: {
                browser: false,
                node: true,
                mocha: false,
            },
        },
        {
            files: ["test/**/*.ts"],
            env: {
                browser: false,
                node: true,
                mocha: true,
            },
        },
    ],
});
