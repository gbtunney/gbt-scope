import {
    ArcRotateCamera,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    Scene,
    Vector3,
} from '@babylonjs/core'
import SceneComponent from 'babylonjs-hook'
import { ReactElement, useState } from 'react'
import InputSlider from './gui/InputSlider.tsx'
import MaterialRadialSymmetry from './MaterialRadialSymmetry.tsx'
import { CameraConfigPosition, setRotateCameraPosition } from '../helpers.ts'

type SceneRadialSymmetryProps = {
    children?: ReactElement
    cameraSettings?: CameraConfigPosition
}

/** Const yty :CameraConfigPosition= {x:0} */
const SceneRadialSymmetry = ({
    cameraSettings = {
        //position: [  0, 5, -10], // eset position
        hRotation: Math.PI / 2,
        vRotation: Math.PI / 4,
    },
    children,
}: SceneRadialSymmetryProps): ReactElement => {
    const [scene, setScene] = useState<Scene | null>(null)
    const [box, setBox] = useState<Mesh | null>(null)
    const [segments, setSegments] = useState<number>(6)
    const [rotation, setRotation] = useState<number>(0)

    const onSceneReady = (_scene: Scene): void => {
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
        camera.attachControl(_scene.getEngine().getRenderingCanvas(), true) // Enable mouse/touch controls
        setRotateCameraPosition(camera, cameraSettings)

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
                    setRotateCameraPosition(camera, cameraSettings)
                }
            })
            // Ensure the canvas can receive keyboard events
            canvas.tabIndex = 1
        }
    }

    return (
        <div>
            {/* InputSlider to control the segments */}
            <InputSlider
                min={3}
                max={20}
                step={1}
                value={segments}
                onChange={(newValue) => {
                    setSegments(newValue)
                }} // Update segments dynamically
                label="Segments"
            />
            <InputSlider
                min={0}
                max={300}
                step={1}
                value={rotation}
                onChange={(newValue) => {
                    setRotation(newValue)
                }} // Update rotation dynamically
                label="Rotation"
            />

            <SceneComponent
                antialias
                onSceneReady={onSceneReady}
                id="my-canvas">
                {scene && box && (
                    <MaterialRadialSymmetry
                        mesh={box}
                        src="uv-checker.png"
                        segments={segments} // Pass the dynamic segments value
                        rotation={rotation}
                        scaleFactor={1.2}
                        offset={[0.1, 0.2]}
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
                    This is some dummy text to demonstrate how additional
                    content can be added to the component. You can replace this
                    with any relevant information or UI elements as needed.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer nec odio. Praesent libero. Sed cursus ante dapibus
                    diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
                </p>
            </div>
        </div>
    )
}

export default SceneRadialSymmetry
