import {
    FreeCamera,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    Scene,
    Vector3,
} from '@babylonjs/core'
import SceneComponent from 'babylonjs-hook'
import { ReactElement, useState } from 'react'
import MaterialRadialSymmetry from './MaterialRadialSymmetry.tsx'

type SceneRadialSymmetryProps = {
    children?: ReactElement
}

const SceneRadialSymmetry = ({
    children,
}: SceneRadialSymmetryProps): ReactElement => {
    const [scene, setScene] = useState<Scene | null>(null)
    const [box, setBox] = useState<Mesh | null>(null)
    /** State to manage the segments value */
    const [segments, setSegments] = useState<number>(6)

    const onSceneReady = (_scene: Scene): void => {
        setScene(_scene)

        // Create a camera
        const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), _scene)
        camera.setTarget(Vector3.Zero())
        camera.attachControl(_scene.getEngine().getRenderingCanvas(), true)

        // Add a light
        new HemisphericLight('light', new Vector3(0, 1, 0), _scene)

        // Create a box
        const boxMesh = MeshBuilder.CreateBox('box', { size: 2 }, _scene)
        boxMesh.position.y = 1 // Move the box upward by half its height
        setBox(boxMesh)
    }

    const increaseSegments = (): void => {
        setSegments((prev) => Math.min(prev + 1, 20)) // Increase segments, max 20
    }

    const decreaseSegments = (): void => {
        setSegments((prev) => Math.max(prev - 1, 3)) // Decrease segments, min 3
    }

    return (
        <div>
            <div style={{ marginTop: '10px' }}>
                <button onClick={decreaseSegments}>Decrease Segments</button>
                <button onClick={increaseSegments}>Increase Segments</button>
                <p>Current Segments: {segments}</p>
            </div>
            <SceneComponent
                antialias
                onSceneReady={onSceneReady}
                id="my-canvas">
                {scene && box && (
                    <MaterialRadialSymmetry
                        mesh={box}
                        src="path/to/your/image.png"
                        segments={segments} // Pass the dynamic segments value
                        rotation={0.5}
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
        </div>
    )
}

export default SceneRadialSymmetry
