import {
    ArcRotateCamera,
    Color4,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    Scene,
    Vector3,
} from '@babylonjs/core'
import { ThemeProvider } from '@mui/material/styles'
import SceneComponent from 'babylonjs-hook'
import { CSSProperties, ReactElement, useEffect, useState } from 'react'
import theme from './gui/theme.js'
import MaterialRadialSymmetry, {
    MaterialRadialSymmetryProps,
} from './MaterialRadialSymmetry.tsx'
import {
    CameraConfigPosition,
    type Dimensions,
    setRotateCameraPosition,
} from '../helpers.ts'
export type SceneRadialSymmetryProps = {
    aspect_ratio?: number | 'parent'
    cameraSettings?: CameraConfigPosition
    resolution?: 'screen' | Dimensions | null
} & Omit<MaterialRadialSymmetryProps, 'mesh'>

const SceneRadialSymmetry = ({
    aspect_ratio = 1,
    cameraSettings = {
        enabled: true,
        hRotation: Math.PI / 2,
        vRotation: Math.PI / 4,
    },
    fps = 60,

    image_aspect = 1,

    name = 'radial-symmetry',
    offset = [0, 0],
    offset_speed = 0,
    offsetScale = 1,
    opacity = 1,
    resolution = null,
    rotation = 0,
    rotation_speed = 0,
    rotationScale = 1,
    scaleFactor = 1,
    segments = 6,
    src = 'uv-checker.png',
    tiling = 1,
}: SceneRadialSymmetryProps): ReactElement => {
    const [scene, setScene] = useState<Scene | null>(null)
    const [box, setBox] = useState<Mesh | null>(null)
    const [_offset, setOffset] = useState<[number, number]>([0, 0])
    const [_dimensions, setDimensions] = useState<Dimensions | undefined>(
        undefined,
    )
    const customStyle: CSSProperties = {
        background: 'purple',
        border: '2px solid green',
        ...(aspect_ratio !== 'parent' ? { aspectRatio: aspect_ratio } : {}),
    }

    useEffect(() => {
        const offsetTuple: [number, number] = [offset[0], offset[1]]
        setOffset(offsetTuple)
    }, [offset])

    useEffect(() => {
        /* if it takes user inputted dimensions */
        if (resolution === 'screen' && scene !== null) {
            const screenDimensions = {
                height: scene.getEngine().getRenderHeight(),
                width: scene.getEngine().getRenderWidth(),
            }
            setDimensions(screenDimensions)
        } else if (
            resolution !== 'screen' &&
            resolution !== undefined &&
            resolution !== null
        ) {
            setDimensions(resolution)
        } else {
            setDimensions(undefined)
        }
    }, [resolution, scene])

    const onSceneReady = (_scene: Scene): void => {
        _scene.clearColor = new Color4(0, 0, 0, 1)
        setScene(_scene)

        // Add ArcRotateCamera
        const camera = new ArcRotateCamera(
            `camera_${name}`,
            cameraSettings.hRotation === undefined
                ? Math.PI / 2
                : cameraSettings.hRotation,
            cameraSettings.vRotation === undefined
                ? Math.PI / 4
                : cameraSettings.vRotation,
            10,
            Vector3.Zero(),
            _scene,
        )
        setRotateCameraPosition(camera, _scene, cameraSettings)

        // Add a light
        new HemisphericLight(`light_${name}`, new Vector3(0, 1, 0), _scene)

        // Create a box mesh
        const boxMesh = MeshBuilder.CreateBox(
            `box_${name}`,
            { size: 2 },
            _scene,
        )
        boxMesh.position.y = 1
        setBox(boxMesh)

        // Add event listener to reset camera on Esc key
        const canvas = _scene.getEngine().getRenderingCanvas()
        if (canvas) {
            canvas.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    setRotateCameraPosition(camera, _scene, cameraSettings)
                }
            })
            canvas.tabIndex = 1 // Ensure the canvas can receive keyboard events
        }

        // Track and remap mouse position
        if (canvas) {
            const handleMouseMove = (event: MouseEvent): void => {
                const rect = canvas.getBoundingClientRect()
                /** Normalize X to [0, 1] */
                const mouseX = (event.clientX - rect.left) / rect.width
                /** Normalize Y to [0, 1] */
                const mouseY = (event.clientY - rect.top) / rect.height

                // Remap to center at 0 and boundaries at -1 and 1
                const remappedX = (mouseX - 0.5) * 2
                const remappedY = (mouseY - 0.5) * 2

                console.log('Mouse Position Remapped:', {
                    x: remappedX,
                    y: remappedY,
                })
            }

            const handleMouseLeave = (): void => {
                console.log('Mouse left the canvas')
            }

            canvas.addEventListener('mousemove', handleMouseMove)
            canvas.addEventListener('mouseleave', handleMouseLeave)

            // Cleanup event listeners when the scene is disposed
            _scene.onDisposeObservable.add(() => {
                canvas.removeEventListener('mousemove', handleMouseMove)
                canvas.removeEventListener('mouseleave', handleMouseLeave)
            })
        }
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <div style={customStyle}>
                    <SceneComponent
                        antialias
                        onSceneReady={onSceneReady}
                        id="my-canvas"
                        style={{
                            height: '100%',
                            width: '100%',
                        }}>
                        {scene && box && (
                            <MaterialRadialSymmetry
                                name={`material_${name}`}
                                mesh={box}
                                src={src}
                                fps={fps}
                                segments={segments}
                                rotation={rotation}
                                scaleFactor={scaleFactor}
                                tiling={tiling}
                                offset={offset}
                                offset_speed={offset_speed}
                                rotationScale={rotationScale}
                                rotation_speed={rotation_speed}
                                offsetScale={offsetScale}
                                opacity={opacity}
                                image_aspect={image_aspect}
                                onInit={(props) => {
                                    console.log(
                                        'INITIALIZED : Material name:',
                                        name,
                                        ' props:',
                                        props,
                                    )
                                }}
                                onUpdate={(props) => {
                                    console.log(
                                        'UPDATED : Material name:',
                                        name,
                                        ' props:',
                                        props,
                                    )
                                }}
                            />
                        )}
                    </SceneComponent>
                </div>
            </ThemeProvider>
        </>
    )
}

export default SceneRadialSymmetry
