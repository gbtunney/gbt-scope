//import './button.css'
import type { Meta, StoryObj } from '@storybook/react'
import SceneRadialSymmetry from './../components/SceneRadialSymmetry.tsx'
import { argTypes, defaultArgs } from './SceneShared.ts'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta = {
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: {
        ...defaultArgs,
        cameraSettings: {
            enabled: true,
            hRotation: Math.PI / 2,
            vRotation: Math.PI / 4,
        },
        resolution: null,
    },
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: argTypes,
    component: SceneRadialSymmetry,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    title: 'Example/SceneRadialSymmetry',
} satisfies Meta<typeof SceneRadialSymmetry>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const AnimatedLeft: Story = {
    args: {
        rotation_speed: 0.02,
    },
}

export const AnimatedRight: Story = {
    args: {
        rotation_speed: -0.02,
    },
}

export const OffsetAnimated_12: Story = {
    args: {
        aspect_ratio: 0.5,
        offset_speed: 0.03,
        segments: 12,
    },
}
export const Segments_4: Story = {
    args: {
        bg_color: 'orange',
        offset_speed: 0.1,
        rotation_speed: -0.3,
        segments: 4,
    },
}
