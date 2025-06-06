import type { Preview } from '@storybook/react'

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on.*' },

        controls: {
            expanded: false,
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
}

export default preview
