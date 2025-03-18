import js from '@eslint/js'
import { EsLint } from '@snailicide/build-config'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import storybook from 'eslint-plugin-storybook'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import url from 'node:url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const FLAT_CONFIG = await EsLint.flatConfig(__dirname)
//plugin:storybook/recommended
export default tseslint.config(
    ...FLAT_CONFIG,

    { ignores: ['dist', 'storybook-static'] },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            ...storybook.configs['flat/recommended'],
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'storybook/story-exports': 'warn',
        },
    },

    ...tseslint.config({
        // extends: [tsEslint.configs.disableTypeChecked],
        files: ['**/*.tsx'],
        rules: {
            '@typescript-eslint/naming-convention': 'off',
            'filenames-simple/naming-convention': 'off',
        },
    }),

    ...tseslint.config({
        // extends: [tsEslint.configs.disableTypeChecked],
        files: ['**/*.stories.ts'],
        rules: {
            '@typescript-eslint/naming-convention': 'off',
            'filenames-simple/naming-convention': 'off',
        },
    }),
)

//filenames-simple/naming-convention
