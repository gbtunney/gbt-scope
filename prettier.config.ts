import { merge, Prettier } from '@snailicide/build-config'
import type { Config as PrettierConfig } from 'prettier'

const overrides: PrettierConfig = {
    overrides: [
        {
            files: '**/*.md',
            options: {
                printWidth: 120,
                proseWrap: 'always',
                tabWidth: 4,
            },
        },
    ],
}

const default_config: PrettierConfig = Prettier.config
const config: PrettierConfig = merge(default_config, overrides)
export default config
