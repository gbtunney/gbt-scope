//import './button.css'
import type { Meta, StoryObj } from '@storybook/react'
import SceneRadialSymmetry, {
    SceneRadialSymmetryProps,
} from './../components/SceneRadialSymmetry.tsx'
import { argTypes, defaultArgs } from './SceneShared.ts'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta = {
    args: {
        ...defaultArgs,
        cameraSettings: {
            enabled: true,
            hRotation: Math.PI / 2,
            vRotation: Math.PI / 4,
        },
        resolution: null,
    },
    argTypes: argTypes,
    component: SceneRadialSymmetry,
    parameters: {
        chromatic: { disableAnimations: true },
        layout: 'centered', // Add Chromatic-specific parameter
    },
    tags: ['autodocs'],
    title: 'Example/SceneRadialSymmetry',
} satisfies Meta<typeof SceneRadialSymmetry>

export default meta
type Story = StoryObj<typeof meta>

/** Helper function to disable animations in Chromatic */
const disableAnimationsForChromatic = (
    args: Partial<SceneRadialSymmetryProps>,
): Partial<SceneRadialSymmetryProps> => {
    if (process.env['CHROMATIC']) {
        console.log('CHROMATIC DISABLED')
        return {
            ...args,
            // Disable rotation animations
            offset_speed: 0,
            rotation_speed: 0, // Disable offset animations
        }
    }
    return args
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const AnimatedLeft: Story = {
    args: disableAnimationsForChromatic({
        rotation_speed: 0.02,
    }),
}

export const AnimatedRight: Story = {
    args: disableAnimationsForChromatic({
        rotation_speed: -0.02,
    }),
}

export const OffsetAnimated_12: Story = {
    args: disableAnimationsForChromatic({
        aspect_ratio: 0.5,
        offset_speed: 0.03,
        segments: 12,
    }),
}

export const Segments_4: Story = {
    args: disableAnimationsForChromatic({
        bg_color: 'yellow',
        offset_speed: 0.1,
        rotation_speed: -0.3,
        segments: 4,
    }),
}
