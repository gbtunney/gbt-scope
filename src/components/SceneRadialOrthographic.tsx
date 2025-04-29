import {
    Color4,
    FreeCamera,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    Scene,
    Vector3,
} from '@babylonjs/core'
import Divider from '@mui/material/Divider'
import { ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import SceneComponent from 'babylonjs-hook'
import { CSSProperties, ReactElement, useState } from 'react'
import ExpandingPanel from './gui/ExpandingPanel.tsx'
import InputSlider from './gui/InputSlider.tsx'
import theme from './gui/theme.js'
import MaterialRadialSymmetry, {
    MaterialRadialSymmetryProps,
} from './MaterialRadialSymmetry.tsx'
import { CameraOrthoConfig, setOrthoCamera } from '../helpers.ts'

type SceneRadialSymmetryProps = {
    aspect_ratio?: number | 'parent'

    children?: ReactElement
    cameraSettings?: CameraOrthoConfig
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

const SceneRadialOrthographic = ({
    aspect_ratio = 1,
    cameraSettings = {
        enabled: false,
        ortho: true,
        target: [0, 0, 0],
    },
    children,
}: SceneRadialSymmetryProps): ReactElement => {
    const [scene, setScene] = useState<Scene | null>(null)
    const [plane, setPlane] = useState<Mesh | null>(null)
    const [aspect, setAspect] = useState<number>(1)
    const [segments, setSegments] = useState<number>(6)
    const [scaleFactor, setScaleFactor] = useState<number>(1)
    const [rotation, setRotation] = useState<number>(0)
    const [offsetScale, setoffsetScale] = useState<number>(0.02)
    const [rotationScale, setRotationScale] = useState<number>(0.2)
    const [_offset, setOffset] = useState<[number, number]>([0, 0])
    const [rotationSpeed, setRotationSpeed] = useState<number>(0)
    const customStyle: CSSProperties = {
        background: 'purple',
        border: '2px solid green',
        ...(aspect_ratio !== 'parent' ? { aspectRatio: aspect_ratio } : {}),
    }

    const updateOffset = (key: 'x' | 'y', value: number): void => {
        const result: [number, number] =
            key === 'x' ? [value, _offset[1]] : [_offset[0], value]
        setOffset(result)
    }

    const onSceneReady = (_scene: Scene): void => {
        _scene.clearColor = new Color4(0, 0, 0, 1)
        setScene(_scene)
        const camera = new FreeCamera(
            'camera_ortho',
            new Vector3(0, 0, -10),
            _scene,
        )
        setOrthoCamera(_scene, camera, cameraSettings)
        // Add a light
        new HemisphericLight('light', new Vector3(0, 1, 0), _scene)
        const planeMesh = MeshBuilder.CreatePlane(
            'plane',
            {
                height: _scene.getEngine().getRenderHeight(),
                width: _scene.getEngine().getRenderWidth(),
            },
            _scene,
        )
        //planeMesh.position.z=900
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
    }

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
                        <InputSlider
                            min={0.001}
                            max={2}
                            step={0.001}
                            value={aspect}
                            onChange={(newValue) => {
                                setAspect(newValue)
                            }}
                            label="Aspect"
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
                                setRotationScale(newValue)
                            }}
                            label="Adjustment Rotation"
                        />{' '}
                        <InputSlider
                            min={0}
                            max={4}
                            step={0.001}
                            value={rotationSpeed}
                            onChange={(newValue) => {
                                setRotationSpeed(newValue)
                            }}
                            label="Rotation Speed"
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
                                mesh={plane}
                                src="uv-checker.png"
                                segments={segments}
                                rotation={rotation}
                                scaleFactor={scaleFactor}
                                offset={_offset}
                                rotationScale={rotationScale}
                                rotation_speed={rotationSpeed}
                                offsetScale={offsetScale}
                                opacity={0.8}
                                image_aspect={aspect}
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
                </div>
            </ThemeProvider>
        </>
    )
}

export default SceneRadialOrthographic
