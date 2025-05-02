import {
    Animation,
    Mesh,
    ShaderMaterial,
    Texture,
    Vector2,
} from '@babylonjs/core'
import { ReactElement, useCallback, useEffect, useRef } from 'react'
import { type Dimensions, getResolution } from '../helpers.js'
import {
    fragmentShader,
    vertexShader,
} from '../materials/shader-radial-symmetry.js'

export type MaterialRadialSymmetryProps = {
    name?: string
    /** The mesh to which the material will be applied */
    mesh: Mesh | null
    /** Texture URL */
    src: string
    dimensions?: Dimensions
    segments?: number
    scaleFactor?: number
    /** RotationScale is a multiplier for rotation value. Is disregarded if rotationSpeed is on. */
    rotationScale?: number
    offsetScale?: number
    rotation?: number
    offset?: [number, number]
    /** Aspect ratio for src image file */
    image_aspect?: number
    opacity?: number
    blendMode?: string
    speed_interval?: number
    /** Rotation Speed will animate if value is greater than 0 */
    rotation_speed?: number
    offset_speed?: number
    mouse_curve?: [number, number]
    mouse_multiplier?: number
    onInit?: (currentProps: MaterialRadialSymmetryProps) => void
    onUpdate?: (currentProps: MaterialRadialSymmetryProps) => void
    /** Frames per second for running animations */
    fps?: number
    /** Tiling factor for the texture */
    tiling?: number
}

const MaterialRadialSymmetry = ({
    blendMode = 'normal',
    dimensions = { height: 1200, width: 1200 },
    fps = 60,
    image_aspect = 1,
    mesh,
    mouse_curve = [0, 1],
    mouse_multiplier = 1,
    name = 'kaleidoscope',
    offset = [0, 0],
    offset_speed = 0,
    offsetScale = 1,
    onInit,
    onUpdate,
    opacity = 1,
    rotation = 0,
    rotation_speed = 0,
    rotationScale = 1,
    scaleFactor = 1,
    segments = 6,
    speed_interval = 0.2,
    src,
    tiling = 1,
}: MaterialRadialSymmetryProps): ReactElement | null => {
    const materialRef = useRef<ShaderMaterial | null>(null)

    // Memoize getPropsObject using useCallback
    const getPropsObject = useCallback((): MaterialRadialSymmetryProps => {
        return {
            blendMode,
            dimensions,
            image_aspect,
            mesh,
            mouse_curve,
            mouse_multiplier,
            name,
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
            tiling,
        }
    }, [
        blendMode,
        dimensions,
        image_aspect,
        mesh,
        mouse_curve,
        mouse_multiplier,
        name,
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
        tiling,
    ])
    // Only run this effect when the mesh or src changes
    useEffect(() => {
        if (!src || !mesh) {
            console.error(
                'MaterialScope: Texture source (src) and mesh are required.',
            )
            return
        }

        if (materialRef.current === null) {
            // Create the shader material
            const shaderMaterial = new ShaderMaterial(
                name,
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
                        'uTiling',
                    ],
                },
            )
            // Load the texture
            const texture = new Texture(src, mesh.getScene(), true, false)
            shaderMaterial.setTexture('uTexture', texture)

            // Apply the material to the mesh
            mesh.material = shaderMaterial
            materialRef.current = shaderMaterial

            // Call the onInit callback if provided
            if (onInit) {
                onInit(getPropsObject())
            }
        }

        return (): void => {
            // Cleanup the material when the component unmounts or when mesh/src changes
            if (materialRef.current !== null) {
                console.log('DISPOSING: material name: ', name)
                materialRef.current.dispose()
                materialRef.current = null
            }
        }
    }, [src, mesh, name, getPropsObject, onInit])
    // Effect for updating uniforms and animations
    useEffect(() => {
        if (!materialRef.current || !src || !mesh) {
            console.error(
                'MaterialScope: Texture source (src) and mesh are required.',
            )
            return
        }

        // Update uniforms
        materialRef.current.setVector4('resolution', getResolution(dimensions))
        materialRef.current.setFloat('uOpacity', opacity)
        materialRef.current.setFloat('segments', segments)
        materialRef.current.setFloat('uRotation', rotation)
        materialRef.current.setFloat('uOffsetAmount', offsetScale)
        materialRef.current.setFloat('uRotationAmount', rotationScale)
        materialRef.current.setFloat('uScaleFactor', scaleFactor)
        materialRef.current.setFloat('uImageAspect', image_aspect)
        materialRef.current.setFloat('uTiling', tiling || 1)
        materialRef.current.setVector2(
            'uOffset',
            new Vector2(offset[0], offset[1]),
        )
        const scene = mesh.getScene()

        let animationArray: Array<Animation> = []
        // Create or update the animation for uOffset
        if (offset_speed !== 0) {
            const offsetAnimation = new Animation(
                'offsetAnimation',
                '_vectors2.uOffset', // The uniform to animate
                fps, // Frames per second
                Animation.ANIMATIONTYPE_VECTOR2,
                Animation.ANIMATIONLOOPMODE_CYCLE,
            )

            const offset_keyFrames = [
                { frame: 0, value: new Vector2(offset[0], offset[1]) }, // Start at initial offset
                {
                    frame: 100,
                    value: new Vector2(
                        dimensions.width * (offset_speed < 0 ? -1 : 1), //* ( offset_speed * 100 / fps),
                        //200,200
                        dimensions.height * (offset_speed < 0 ? -1 : 1),
                        //  offset[1] + offset_speed * 100 / fps,
                    ), // End offset after 100 frames
                },
            ]

            offsetAnimation.setKeys(offset_keyFrames)
            animationArray = [...animationArray, offsetAnimation]

            // Start the animation
            scene.beginDirectAnimation(
                materialRef.current,
                [offsetAnimation],
                0,
                100,
                true,
                Math.abs(offset_speed),
            )
        } else {
            scene.stopAnimation(materialRef.current, 'offsetAnimation')
        }

        if (rotation_speed !== 0) {
            // Create or update the animation for uRotation
            const rotationAnimation = new Animation(
                'rotationAnimation',
                '_floats.uRotation', // The uniform to animate
                fps, // Frames per second
                Animation.ANIMATIONTYPE_FLOAT,
                Animation.ANIMATIONLOOPMODE_CYCLE,
            )

            const rotation_keyFrames = [
                { frame: 0, value: 0 }, // Start rotation at 0
                {
                    frame: 100,
                    value:
                        ((Math.PI * 2) / rotationScale) *
                        (rotation_speed < 0 ? -1 : 1),
                }, // Complete one full rotation
            ]

            console.log(
                '(math vlue ',
                ((Math.PI * 2) / rotationScale) * (rotation_speed < 0 ? -1 : 1),
            )
            rotationAnimation.setKeys(rotation_keyFrames)

            // Attach the animation to the material

            animationArray = [...animationArray, rotationAnimation]
            const speedRatio =
                rotation_speed !== 0 ? Math.abs(rotation_speed) : 1
            scene.beginDirectAnimation(
                materialRef.current,
                [rotationAnimation],
                0,
                100,
                true,
                speedRatio,
            )
        } else {
            scene.stopAnimation(materialRef.current, 'rotationAnimation')
        }

        materialRef.current.animations = animationArray

        // Call the onUpdate callback if provided
        if (onUpdate) {
            onUpdate(getPropsObject())
        }
    }, [
        mesh,
        dimensions,
        src,
        opacity,
        segments,
        offset,
        offset_speed, // Add offset_speed to the dependency array
        rotation,
        offsetScale,
        rotationScale,
        scaleFactor,
        image_aspect,
        rotation_speed,
        fps,
        tiling,
        onUpdate,
        getPropsObject,
    ])

    return null // This component doesn't render anything directly
}

export default MaterialRadialSymmetry
