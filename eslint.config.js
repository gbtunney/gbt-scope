import { EsLint } from '@snailicide/build-config'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import storybook from 'eslint-plugin-storybook'
import tseslint from 'typescript-eslint'
import url from 'node:url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const FLAT_CONFIG = await EsLint.flatConfig(__dirname)

const _plugins = storybook

export default tseslint.config(
    ...FLAT_CONFIG,

    { ignores: ['dist', 'storybook-static', 'scratch'] },
    {
        extends: [
            // js.configs.recommended,
            //...tseslint.configs.recommended,
            ...storybook.configs['flat/recommended'],
        ],
        files: ['**/*.{ts,tsx}'],
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            // 'storybook': storybook,
        },
        rules: {
            ...storybook.configs['flat/recommended'].rules,
            ...reactHooks.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': 'warn',
            'import/no-default-export': 'off',
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'storybook/story-exports': 'warn',
        },
    },
    ...tseslint.config({
        // extends: [tsEslint.configs.disableTypeChecked],
        files: ['**/*.stories.ts', '**/*.tsx'],
        rules: {
            '@typescript-eslint/naming-convention': 'off',
            'filenames-simple/naming-convention': 'off',
        },
    }),
)
