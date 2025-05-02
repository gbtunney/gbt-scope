import type { StorybookConfig } from '@storybook/react-vite'

import { dirname, join } from 'path'

/**
 * This function is used to resolve the absolute path of a package. It is needed in projects that use Yarn PnP or are
 * set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
    return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
    addons: [
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@storybook/addon-onboarding'),
        getAbsolutePath('@storybook/addon-interactions'),
        getAbsolutePath('@chromatic-com/storybook'),
    ],
    framework: {
        name: getAbsolutePath('@storybook/react-vite'),
        options: {},
    },
    stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    typescript: {
        check: true,
        reactDocgen: 'react-docgen-typescript',
        reactDocgenTypescriptOptions: {
            propFilter: (prop) => {
                // Exclude the 'css' prop
                if (prop.name === 'css' || prop.name === 'style') {
                    return false
                }
                if (prop.name === 'cssStyles') {
                    return true
                }
                const res = !/node_modules/.test(prop.parent?.fileName ?? '')
                return prop.parent ? res : true
            },
            shouldExtractLiteralValuesFromEnum: true,
            shouldExtractValuesFromUnion: true,
            shouldIncludeExpression: false,
            shouldRemoveUndefinedFromOptional: true,
        },
    },
}
export default config
