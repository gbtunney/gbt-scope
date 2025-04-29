import {
    Animation,
    Mesh,
    ShaderMaterial,
    Texture,
    Vector2,
    Vector4,
} from '@babylonjs/core'
import { ReactElement, useEffect, useRef } from 'react'
import {
    fragmentShader,
    vertexShader,
} from '../materials/shader-radial-symmetry.js'

export type MaterialRadialSymmetryProps = {
    /** The mesh to which the material will be applied */
    mesh: Mesh | null
    src: string /** Texture URL */
    segments?: number
    scaleFactor?: number
    rotationScale?: number
    offsetScale?: number
    rotation?: number
    offset?: [number, number]
    image_aspect?: number
    opacity?: number
    blendMode?: string
    speed_interval?: number
    rotation_speed?: number
    offset_speed?: number
    mouse_curve?: [number, number]
    mouse_multiplier?: number
    onInit?: (currentProps: MaterialRadialSymmetryProps) => void
}

const MaterialRadialSymmetry = ({
    blendMode = 'normal',
    image_aspect = 1,
    mesh,
    mouse_curve = [0, 1],
    mouse_multiplier = 1,
    offset = [0, 0],
    offset_speed = 0,
    offsetScale = 1,
    onInit,
    opacity = 1,
    rotation = 0,
    rotation_speed = 0,
    rotationScale = 1,
    scaleFactor = 1,
    segments = 6,
    speed_interval = 0.2,
    src,
}: MaterialRadialSymmetryProps): ReactElement | null => {
    const materialRef = useRef<ShaderMaterial | null>(null)

    useEffect(() => {
        if (!src || !mesh) {
            console.error(
                'MaterialScope: Texture source (src) and mesh are required.',
            )
            return
        }

        // Create the shader material
        const shaderMaterial = new ShaderMaterial(
            'kaleidoscopeShader',
            mesh.getScene(),
            {
                fragmentSource: fragmentShader,
                vertexSource: vertexShader,
            },
            {
                attributes: ['position', 'uv'],
                uniforms: [
                    'worldViewProjection',
                    'uTexture',
                    'resolution',
                    'uOpacity',
                    'segments',
                    'uOffset',
                    'uRotation',
                    'uOffsetAmount',
                    'uRotationAmount',
                    'uScaleFactor',
                    'uImageAspect',
                ],
            },
        )

        // Load the texture
        const texture = new Texture(src, mesh.getScene(), true, false)
        shaderMaterial.setTexture('uTexture', texture)

        // Set default uniform values
        shaderMaterial.setVector4('resolution', new Vector4(1200, 1200, 1, 1))
        shaderMaterial.setFloat('uOpacity', opacity)
        shaderMaterial.setFloat('segments', segments)
        shaderMaterial.setVector2('uOffset', new Vector2(offset[0], offset[1]))
        shaderMaterial.setFloat('uRotation', rotation)
        shaderMaterial.setFloat('uOffsetAmount', offsetScale)
        shaderMaterial.setFloat('uRotationAmount', rotationScale)
        shaderMaterial.setFloat('uScaleFactor', scaleFactor)
        shaderMaterial.setFloat('uImageAspect', image_aspect)
        // Apply the material to the mesh
        mesh.material = shaderMaterial
        materialRef.current = shaderMaterial

        // Create an animation for uRotation
        const scene = mesh.getScene()
        const rotationAnimation = new Animation(
            'rotationAnimation',
            '_floats.uRotation', // The uniform to animate
            60, // Frames per second
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CYCLE,
        )

        // Define keyframes for the animation
        const keyFrames = [
            { frame: 0, value: 0 }, // Start rotation at 0
            { frame: 100, value: Math.PI * 2 }, // Complete one full rotation
        ]

        rotationAnimation.setKeys(keyFrames)

        // Attach the animation to the material
        shaderMaterial.animations = [rotationAnimation]

        if (rotation_speed > 0) {
            // Start the animation with speed based on rotation_speed
            /** Default to 1 if rotation_speed is 0 or undefined */
            const speedRatio = rotation_speed > 0 ? rotation_speed : 1
            scene.beginDirectAnimation(
                shaderMaterial,
                [rotationAnimation],
                0,
                100,
                true,
                speedRatio,
            )
        } else {
            scene.stopAnimation(shaderMaterial, 'rotationAnimation')
        }
        // Call the onInit callback if provided
        if (onInit) {
            onInit({
                blendMode,
                image_aspect,
                mesh,
                mouse_curve,
                mouse_multiplier,
                offset,
                offset_speed,
                offsetScale,
                opacity,
                rotation,
                rotation_speed,
                rotationScale,
                scaleFactor,
                segments,
                speed_interval,
                src,
            })
        }

        return (): void => {
            // Cleanup the material when the component unmounts
            shaderMaterial.dispose()
        }
    }, [
        blendMode,
        image_aspect,
        mesh,
        mouse_curve,
        mouse_multiplier,
        offset,
        offsetScale,
        offset_speed,
        onInit,
        opacity,
        rotation,
        rotationScale,
        rotation_speed,
        scaleFactor,
        segments,
        speed_interval,
        src,
    ])

    return null // This component doesn't render anything directly
}

export default MaterialRadialSymmetry
