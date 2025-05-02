import type { Meta, StoryObj } from '@storybook/react'
import SceneGBTScope from '../components/SceneGBTScope.tsx'
import type { SceneGBTScopeProps } from '../components/SceneGBTScope.tsx'
/* eslint  sort/object-properties: "off" */

const defaultArgs: SceneGBTScopeProps = {
    aspect_ratio: 1,
    resolution: 'screen',
    fps: 60,
    image_aspect: 1,
    offset: [0, 0],
    offsetScale: 0.02,
    offset_speed: 0,
    rotation: 0,
    rotation_speed: 0,
    rotationScale: 1,
    scaleFactor: 1,
    segments: 6,
    tiling: 1,
    src: 'uv-checker.png',
}
const meta: Meta<typeof SceneGBTScope> = {
    argTypes: {
        //  Rotation Settings
        rotation: {
            control: { max: 360, min: 0, step: 0.1, type: 'number' },
            table: { category: 'Rotation Settings' },
        },
        rotation_speed: {
            control: { max: 4, min: -4, step: 0.01, type: 'number' },
            table: { category: 'Rotation Settings' },
        },
        rotationScale: {
            control: { max: 4, min: 0.001, step: 0.001, type: 'number' },
            table: { category: 'Rotation Settings' },
        },

        // Group 1: General Settings
        src: {
            control: { type: 'select' },
            options: ['uv-checker.png', 'gradient4-3.png', 'eel.jpg'],
            table: { category: 'General Settings' },
        },
        aspect_ratio: {
            control: { type: 'select' },
            options: {
                // @ts-expect-error: this is annoyinig and stupid
                '1:1': 1,
                '1:2': 0.5,
                '3:2': 1.5,
                '4:3': 1.33333333,
                '16:9': 1.7777778,
            },
            table: { category: 'General Settings' },
        },
        image_aspect: {
            description: 'Src Image aspect ratio',
            control: { max: 4, min: 0.01, step: 0.1, type: 'number' },
            table: { category: 'General Settings' },
        },
        //  Graphic Settings
        tiling: {
            control: { max: 20, min: 1, step: 1, type: 'number' },
            table: { category: 'Graphic Settings' },
        },
        scaleFactor: {
            control: { max: 3, min: 0.01, step: 0.1, type: 'number' },
            table: { category: 'Graphic Settings' },
        },
        segments: {
            control: { max: 30, min: 1, step: 1, type: 'number' },
            table: { category: 'Graphic Settings' },
        },

        // Group 3: Offset Settings
        offset: {
            control: { type: 'object' },
            table: { category: 'Offset Settings' },
        },
        offset_speed: {
            control: { max: 4, min: -4, step: 0.01, type: 'number' },
            table: { category: 'Offset Settings' },
        },

        offsetScale: {
            control: { max: 4, min: 0.001, step: 0.01, type: 'number' },
            table: { category: 'Offset Settings' },
        },

        // Group 5: Animation Settings
        fps: {
            description: 'Frames per second',
            control: { max: 120, min: 10, step: 1, type: 'number' },
            table: { category: 'Animation Settings' },
        },
    },
    component: SceneGBTScope,
    parameters: {
        layout: 'centered',
    },
    args: defaultArgs,
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
