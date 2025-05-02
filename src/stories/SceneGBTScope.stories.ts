import type { Meta, StoryObj } from '@storybook/react'
import { argTypes, defaultArgs } from './SceneShared.ts'

import SceneGBTScope from '../components/SceneGBTScope.tsx'
/* eslint  sort/object-properties: "off" */

const meta: Meta<typeof SceneGBTScope> = {
    argTypes,
    component: SceneGBTScope,
    parameters: {
        layout: 'centered',
    },
    args: {
        ...defaultArgs,
        cameraSettings: {
            enabled: false,
            ortho: true,
            target: [0, 0, 0],
        },
        resolution: 'screen',
    },
    tags: ['autodocs'],
    title: 'Example/SceneGBTScope',
} satisfies Meta<typeof SceneGBTScope>

export default meta

type ScopeStory = StoryObj<typeof meta>

// Primary story with all props
export const GBTScope_1_1: ScopeStory = {
    args: {
        ...defaultArgs,
        aspect_ratio: 1,
    },
}
// Primary story with all props
export const GBTScope_1_1B: ScopeStory = {
    args: {
        ...defaultArgs,
        offset: [100, 30],
        offsetScale: 0.02,
        name: 'gbtscope1b',
    },
}

// Secondary story with some props overridden
export const GBTScope_1_2: ScopeStory = {
    args: {
        ...defaultArgs,
        aspect_ratio: 0.5,
    },
}

// Secondary story with some props overridden
export const GBTScope_16_9: ScopeStory = {
    args: {
        ...defaultArgs,
        aspect_ratio: 1.7777777778,
    },
}
