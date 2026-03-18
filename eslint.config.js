import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    resolvePluginsRelativeTo: __dirname,
});

export default [
    // Ignore patterns for the root ESLint configuration
    {
        ignores: [
            'data/scripts/**/*.js',
            'packages/logic/dist/**/*.js',
            'tt2-master/**/*.js',
            'TapTitans2AlchemyCalculator/**/*.js',
            'TapTitans2Optimiser/**/*.js',
            'apps/mobile/dist/*'
        ],
    },
    // Import the ESLint configuration from apps/mobile/.eslintrc.js
    ...compat.extends(path.join(__dirname, 'apps/mobile/.eslintrc.js')),
];
