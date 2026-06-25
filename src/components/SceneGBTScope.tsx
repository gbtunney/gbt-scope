import {
    Color4,
    FreeCamera,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    Scene,
    ShaderMaterial,
    Vector3,
} from '@babylonjs/core'
import { ThemeProvider } from '@mui/material/styles'
import { type Chromable, colorUtils } from '@snailicide/g-library'
import SceneComponent from 'babylonjs-hook'
import { CSSProperties, ReactElement, useEffect, useState } from 'react'
import theme from './gui/theme.js'
import MaterialRadialSymmetry, {
    type MaterialRadialSymmetryProps,
} from './MaterialRadialSymmetry.tsx'
import {
   type CameraOrthoConfig,
    type Dimensions,
    setOrthoCamera,
} from '../helpers.ts'

export type SceneGBTScopeProps = {
    /** This is the aspect ratio of the html5canvas */
    aspect_ratio?: number | 'parent'
    cameraSettings?: CameraOrthoConfig
    /** Resolution set to null will default to 1024x1024. value of "screen" will set the resolution to match viewport */
    resolution?: 'screen' | Dimensions | null
    bg_color?: Chromable
} & Omit<MaterialRadialSymmetryProps, 'mesh' | 'dimensions'>

const SceneGBTScope = ({
    aspect_ratio = 1,
    //={width:1024,height:1024},
    bg_color = 'red',
    cameraSettings = {
        enabled: false,
        ortho: true,
        target: [0, 0, 0],
    },
    fps = 60,
    image_aspect = 1,
    mouse_curve = [0, 0.015] as [number, number],
    mouse_multiplier = 0.01,
    name = 'kaleidoscope',
    offset = [0, 0],
    offset_speed = 0,
    offsetScale = 1,
    opacity = 1,
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
    const customStyle: CSSProperties = {
        backgroundColor: colorUtils.isValidColor(bg_color)
            ? colorUtils.getChromaColor(bg_color)?.hex()
            : 'initial',
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

        // Mouse state — plain object so the observable closure always reads current values
        const mouseState = { x: 0, y: 0 }

        if (canvas) {
            const handleMouseMove = (event: MouseEvent): void => {
                const rect = canvas.getBoundingClientRect()
                mouseState.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
                mouseState.y = ((event.clientY - rect.top) / rect.height) * 2 - 1
            }
            const handleMouseLeave = (): void => {
                mouseState.x = 0
                mouseState.y = 0
            }
            canvas.addEventListener('mousemove', handleMouseMove)
            canvas.addEventListener('mouseleave', handleMouseLeave)
            _scene.onDisposeObservable.add(() => {
                canvas.removeEventListener('mousemove', handleMouseMove)
                canvas.removeEventListener('mouseleave', handleMouseLeave)
            })
        }

        // Accumulate rotation each frame; speed increases with mouse distance from center
        let currentRotation = rotation
        const BASE_SPEED = 0.003
        _scene.onBeforeRenderObservable.add(() => {
            const dist = Math.sqrt(mouseState.x ** 2 + mouseState.y ** 2)
            const mouseContrib = Math.min(
                Math.max(dist * mouse_multiplier, mouse_curve[0]),
                mouse_curve[1],
            )
            currentRotation += BASE_SPEED + mouseContrib
            const mat = planeMesh.material as ShaderMaterial
            if (mat) mat.setFloat('uRotation', currentRotation)
        })
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
                                rotation_speed={0}
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

export default SceneGBTScope
