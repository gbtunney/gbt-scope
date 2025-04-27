import {
    ArcRotateCamera,
    Color4,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    Scene,
    Vector3,
} from '@babylonjs/core'
import Divider from '@mui/material/Divider'
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import SceneComponent from 'babylonjs-hook'
import { ReactElement, useEffect, useState } from 'react'
import ExpandingPanel from './gui/ExpandingPanel.tsx'
import InputSlider from './gui/InputSlider.tsx'
import MaterialRadialSymmetry, {
    MaterialRadialSymmetryProps,
} from './MaterialRadialSymmetry.tsx'
import { CameraConfigPosition, setRotateCameraPosition } from '../helpers.ts'
export const themeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#f7f1b3',
        },
        secondary: {
            main: '#66bb6a',
        },
        background: {
            default: '#1a130a',
            paper: '#1a130a',
        },
        text: {
            primary: '#e8e8e8',
        },
        error: {
            main: '#d32f2f',
        },
        divider: '#a6a68b',
    },
    typography: {
        button: {
            fontFamily: 'Cormorant+Garamond',
            fontSize: '1rem',
        },
        fontSize: 16,
        fontFamily: 'Source Sans Pro',
        h1: {
            fontFamily: 'Cormorant+Garamond',
        },

        body2: {
            fontSize: '.8rem',
        },
    },
}
const theme = createTheme(themeOptions)

type SceneRadialSymmetryProps = {
    children?: ReactElement
    cameraSettings?: CameraConfigPosition
}
type ControlProps = Pick<
    MaterialRadialSymmetryProps,
    | 'segments'
    | 'rotation'
    | 'rotationScale'
    | 'offsetScale'
    | 'offset'
    | 'scaleFactor'
>

const SceneRadialSymmetry = ({
    cameraSettings = {
        enabled: true,
        hRotation: Math.PI / 2,
        vRotation: Math.PI / 4,
    },
    children,
}: SceneRadialSymmetryProps): ReactElement => {
    const [scene, setScene] = useState<Scene | null>(null)
    const [box, setBox] = useState<Mesh | null>(null)
    const [segments, setSegments] = useState<number>(6)
    const [scaleFactor, setScaleFactor] = useState<number>(1)
    const [rotation, setRotation] = useState<number>(0)
    const [offsetScale, setoffsetScale] = useState<number>(0.02)
    const [rotationScale, setrotationScale] = useState<number>(0.2)
    const [_offset, setOffset] = useState<[number, number]>([0, 0])

    const updateOffset = (key: 'x' | 'y', value: number): void => {
        const result: [number, number] =
            key === 'x' ? [value, _offset[1]] : [_offset[0], value]
        setOffset(result)
    }

    const onSceneReady = (_scene: Scene): void => {
        _scene.clearColor = new Color4(0, 0, 0, 1)
        setScene(_scene)

        // Create an ArcRotateCamera for zoom and rotation
        const camera = new ArcRotateCamera(
            'camera1',
            0,
            0,
            0,
            Vector3.Zero(),
            _scene,
        )

        //  camera.mode  = Camera.ORTHOGRAPHIC_CAMERA
        // Enable mouse/touch controls
        setRotateCameraPosition(camera, _scene, cameraSettings)

        // Add a light
        new HemisphericLight('light', new Vector3(0, 1, 0), _scene)

        // Create a box
        const boxMesh = MeshBuilder.CreateBox('box', { size: 2 }, _scene)
        boxMesh.position.y = 1 // Move the box upward by half its height
        setBox(boxMesh)

        // Add event listener to reset camera on Esc key
        const canvas = _scene.getEngine().getRenderingCanvas()
        if (canvas) {
            canvas.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    setRotateCameraPosition(camera, _scene, cameraSettings)
                }
            })
            // Ensure the canvas can receive keyboard events
            canvas.tabIndex = 1
        }
    }

    // Animate the rotation property continuously
    useEffect(() => {
        let animationFrameId: number

        const animate = (): void => {
            setRotation((prev) => prev + 0.01) // Increment rotation and keep it within 0-360
            animationFrameId = requestAnimationFrame(animate)
        }
        /** TODO: redo this animationFrameId = requestAnimationFrame(animate) */
        return (): void => {
            cancelAnimationFrame(animationFrameId)
        } // Cleanup on unmount
    }, [])

    return (
        <>
            <ThemeProvider theme={theme}>
                <ExpandingPanel>
                    <>
                        <Typography>[esc] to reset camera</Typography>
                        <InputSlider
                            min={3}
                            max={20}
                            step={1}
                            value={segments}
                            onChange={(newValue) => {
                                setSegments(newValue)
                            }}
                            label="Segments"
                        />
                        <InputSlider
                            min={0.02}
                            max={3}
                            step={0.001}
                            value={scaleFactor}
                            onChange={(newValue) => {
                                setScaleFactor(newValue)
                            }}
                            label="Scale Factor"
                        />
                        <Divider />

                        <InputSlider
                            min={0}
                            max={360}
                            step={0.001}
                            value={rotation}
                            onChange={(newValue) => {
                                setRotation(newValue)
                            }}
                            label="Rotation"
                        />
                        <InputSlider
                            min={0.001}
                            max={4}
                            step={0.001}
                            value={rotationScale}
                            onChange={(newValue) => {
                                setrotationScale(newValue)
                            }}
                            label="Adjustment Rotation"
                        />
                        <Divider />
                        <InputSlider
                            min={0}
                            max={300}
                            step={0.01}
                            value={_offset[0]}
                            onChange={(newValue) => {
                                updateOffset('x', newValue)
                            }}
                            label="Offset X"
                        />
                        <InputSlider
                            min={0}
                            max={300}
                            step={0.01}
                            value={_offset[1]}
                            onChange={(newValue) => {
                                updateOffset('y', newValue)
                            }}
                            label="Offset Y"
                        />
                        <InputSlider
                            min={0.001}
                            max={4}
                            step={0.01}
                            value={offsetScale}
                            onChange={(newValue) => {
                                setoffsetScale(newValue)
                            }}
                            label="Adjustment Offset"
                        />
                    </>
                </ExpandingPanel>
                <div>
                    <SceneComponent
                        antialias
                        onSceneReady={onSceneReady}
                        id="my-canvas"
                        style={{
                            width: '100%',
                            height: '100%',
                        }}>
                        {scene && box && (
                            <MaterialRadialSymmetry
                                mesh={box}
                                src="uv-checker.png"
                                segments={segments}
                                rotation={rotation}
                                scaleFactor={scaleFactor}
                                offset={_offset}
                                rotationScale={rotationScale}
                                offsetScale={offsetScale}
                                opacity={0.8}
                                onInit={(props) => {
                                    console.log(
                                        'Material initialized with props:',
                                        props,
                                    )
                                }}
                            />
                        )}
                        {children}
                    </SceneComponent>
                    <div>
                        <p>
                            This is some dummy text to demonstrate how
                            additional content can be added to the component.
                            You can replace this with any relevant information
                            or UI elements as needed.
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Integer nec odio. Praesent libero. Sed cursus
                            ante dapibus diam. Sed nisi. Nulla quis sem at nibh
                            elementum imperdiet.
                        </p>
                    </div>
                </div>
            </ThemeProvider>
        </>
    )
}

export default SceneRadialSymmetry
