import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
    { ignores: ["node_modules", "generated", "src/resume-uploads"] },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ["**/*.ts"],
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                // Enables type-aware rules below, using tsconfig.json
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // Unawaited promises in an Express backend = unhandled rejections and lost errors
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: { arguments: false } }],
            "@typescript-eslint/await-thenable": "error",

            // Codebase uses `any` widely today; warn so it's visible without blocking
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
        },
    },

    // Config files at the project root aren't part of tsconfig's type-checked program
    {
        files: ["*.config.js", "*.config.ts"],
        ...tseslint.configs.disableTypeChecked,
    },
)
