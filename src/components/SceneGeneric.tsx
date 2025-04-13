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
import { Vector3Params } from '../helpers.js'
import { getTextureShaderMaterial } from '../materials/index.js'
type SceneGenericProps = {
    camera_position?: Vector3Params
    children?: ReactElement
}
/** THIS Is a GENERIC SCENE USAGE */
const SceneGeneric = ({
    camera_position = [0, 0, -200],
    children,
}: SceneGenericProps): ReactElement => {
    const [scene, setScene] = useState<Scene | null>(null)
    const [box, setBox] = useState<Mesh | null>(null)
    /** State to manage the segments value */
    const [segments, setSegments] = useState<number>(6)

    const onSceneReady = (_scene: Scene): void => {
        setScene(_scene)
        // Create a camera
        console.log('camera position', camera_position)

        /*   TODO: this doesnt work yet
           const vPosition :Vector3= new Vector3(...((camera_position===undefined)?[0,0,-200]:camera_position))
        const camera = new FreeCamera("camera1",vPosition , _scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(_scene.getEngine().getRenderingCanvas(), true);*/

        const camera = new FreeCamera('camera1', new Vector3(0, 5, -20), _scene)
        camera.setTarget(Vector3.Zero())
        camera.attachControl(_scene.getEngine().getRenderingCanvas(), true)
        // Add a light
        new HemisphericLight('light', new Vector3(0, 1, 0), _scene)

        // Create a box
        const boxMesh = MeshBuilder.CreateBox('box', { size: 2 }, _scene)
        boxMesh.position.y = 1 // Move the box upward by half its height
        // Create a materiial
        const textureMaterial = getTextureShaderMaterial(_scene)
        boxMesh.material = textureMaterial

        setBox(boxMesh)
    }
    return (
        <div>
            <SceneComponent
                antialias
                onSceneReady={onSceneReady}
                id="my-canvas">
                {children}
            </SceneComponent>
        </div>
    )
}

export default SceneGeneric
