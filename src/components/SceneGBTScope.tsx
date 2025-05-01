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
import { CSSProperties, ReactElement, useState } from 'react'
import theme from './gui/theme.js'
import MaterialRadialSymmetry, {
    MaterialRadialSymmetryProps,
} from './MaterialRadialSymmetry.tsx'
import { CameraOrthoConfig, setOrthoCamera } from '../helpers.ts'

export type SceneGBTScopeProps = {
    /** This is the aspect ratio of the html5canvas */
    aspect_ratio?: number | 'parent'
    scale?: number
    cameraSettings?: CameraOrthoConfig
} & Omit<MaterialRadialSymmetryProps, 'mesh'>
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
    fps = 60,
    image_aspect = 1,
    offset = [0, 0],
    offsetScale = 1,
    rotation = 0,
    rotation_speed = 0,
    rotationScale = 1,
    scaleFactor = 1,
    segments = 6,
    src = 'uv-checker.png',
}: SceneGBTScopeProps): ReactElement => {
    const [scene, setScene] = useState<Scene | null>(null)
    const [plane, setPlane] = useState<Mesh | null>(null)
    const customStyle: CSSProperties = {
        background: 'purple',
        border: '2px solid green',
        ...(aspect_ratio !== 'parent' ? { aspectRatio: aspect_ratio } : {}),
    }

    const getCanvasSize = (_scene: Scene): number => {
        return _scene.getEngine().getRenderWidth() >=
            _scene.getEngine().getRenderHeight()
            ? _scene.getEngine().getRenderWidth()
            : _scene.getEngine().getRenderHeight()
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
                height: getCanvasSize(_scene),
                width: getCanvasSize(_scene),
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
                                src={src}
                                segments={segments}
                                rotation={rotation}
                                scaleFactor={scaleFactor}
                                offset={offset}
                                rotationScale={rotationScale}
                                rotation_speed={rotation_speed}
                                offsetScale={offsetScale}
                                opacity={0.8}
                                image_aspect={image_aspect}
                                onInit={(props) => {
                                    console.log(
                                        'Material initialized with props:',
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
