import {
    Color4,
    FreeCamera,
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
    CameraOrthoConfig,
    type Dimensions,
    setOrthoCamera,
} from '../helpers.ts'

export type SceneGBTScopeProps = {
    /** This is the aspect ratio of the html5canvas */
    aspect_ratio?: number | 'parent'
    scale?: number
    cameraSettings?: CameraOrthoConfig
    resolution?: 'screen' | Dimensions | null
} & Omit<MaterialRadialSymmetryProps, 'mesh' | 'dimensions'>
type ControlProps = Pick<
    MaterialRadialSymmetryProps,
    | 'segments'
    | 'rotation'
    | 'rotationScale'
    | 'offsetScale'
    | 'offset'
    | 'scaleFactor'
>

const SceneGBTScope = ({
    aspect_ratio = 1,
    cameraSettings = {
        enabled: false,
        ortho: true,
        target: [0, 0, 0],
    },
    //={width:1024,height:1024},
    fps = 60,
    image_aspect = 1,
    name = 'kaleidoscope',
    offset = [0, 0],
    offset_speed = 0,
    offsetScale = 1,
    resolution = 'screen',
    rotation = 0,
    rotation_speed = 0,
    rotationScale = 1,
    scaleFactor = 1,
    segments = 6,
    src = 'uv-checker.png',
    tiling = 1,
}: SceneGBTScopeProps): ReactElement => {
    const [scene, setScene] = useState<Scene | null>(null)
    const [plane, setPlane] = useState<Mesh | null>(null)
    const [_offset, setOffset] = useState<[number, number]>([0, 0])
    const [_dimensions, setDimensions] = useState<Dimensions | undefined>(
        undefined,
    )
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

    const customStyle: CSSProperties = {
        background: 'purple',
        border: '2px solid green',
        ...(aspect_ratio !== 'parent' ? { aspectRatio: aspect_ratio } : {}),
    }
    const getCanvasSize = (_scene: Scene): number => {
        const { height, width } = {
            height: _scene.getEngine().getRenderHeight(),
            width: _scene.getEngine().getRenderWidth(),
        }
        return width >= height ? width : height
    }

    const onSceneReady = (_scene: Scene): void => {
        _scene.clearColor = new Color4(0, 0, 0, 1)
        setScene(_scene)

        const camera = new FreeCamera(
            `camera_${name}`,
            new Vector3(0, 0, -10),
            _scene,
        )
        setOrthoCamera(_scene, camera, cameraSettings)

        // Add a light
        new HemisphericLight(`light_${name}`, new Vector3(0, 1, 0), _scene)

        const planeMesh = MeshBuilder.CreatePlane(
            `plane_${name}`,
            {
                height: _scene.getEngine().getRenderHeight(),
                width: _scene.getEngine().getRenderWidth(),
            },
            _scene,
        )
        setPlane(planeMesh)

        // Add event listener to reset camera on Esc key
        const canvas = _scene.getEngine().getRenderingCanvas()
        if (canvas && camera !== null) {
            canvas.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    setOrthoCamera(_scene, camera, cameraSettings)
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

                // Remap to center at 0.5 and boundaries at -1 and 1
                /** Map to [-1, 1] */
                const remappedX = (mouseX - 0.5) * 2
                /** Map to [-1, 1] */
                const remappedY = (mouseY - 0.5) * 2

                // console.log('Remapped Mouse Position:', { x: remappedX, y: remappedY })
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
                        {scene && plane && (
                            <MaterialRadialSymmetry
                                name={`material_${name}`}
                                mesh={plane}
                                src={src}
                                dimensions={_dimensions}
                                fps={fps}
                                segments={segments}
                                rotation={rotation}
                                scaleFactor={scaleFactor}
                                tiling={tiling}
                                offset={_offset}
                                offset_speed={offset_speed}
                                rotationScale={rotationScale}
                                rotation_speed={rotation_speed}
                                offsetScale={offsetScale}
                                opacity={0.8}
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

export default SceneGBTScope
