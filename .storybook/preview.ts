import type { Preview } from '@storybook/react'
console.log('JUNK TEST')

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
