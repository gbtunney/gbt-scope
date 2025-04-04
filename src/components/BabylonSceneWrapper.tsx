import {
    FreeCamera,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    Scene,
    Vector3,
} from '@babylonjs/core'
import SceneComponent from 'babylonjs-hook'
import { ReactElement, useEffect, useRef, useState } from 'react'

type BabylonSceneWrapperProps = {
    testing1?: number
    testing2?: string
    children?: ReactElement
    onCallback?: (value: number) => void
}

const BabylonSceneWrapper = ({
    children,
    onCallback,
    testing1 = 4,
    testing2 = 'GBT',
}: BabylonSceneWrapperProps): ReactElement => {
    const [scene, setScene] = useState<Scene | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const cameraRef = useRef<FreeCamera | null>(null)
    const boxRef = useRef<Mesh | null>(null)

    const onSceneReady = (_scene: Scene): void => {
        console.log('WRAPPER: onSceneReady called!', _scene)

        // Set the scene state
        setScene(_scene)

        // Create a camera
        const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), _scene)
        camera.setTarget(Vector3.Zero())
        camera.attachControl(_scene.getEngine().getRenderingCanvas(), true)
        cameraRef.current = camera

        // Add a light
        const light = new HemisphericLight(
            'light',
            new Vector3(0, 1, 0),
            _scene,
        )
        light.intensity = 0.7

        // Create a box
        const box = MeshBuilder.CreateBox('box', { size: 2 }, _scene)
        box.position.y = 1 // Move the box upward by half its height
        boxRef.current = box

        // Create a ground
        MeshBuilder.CreateGround('ground', { height: 6, width: 6 }, _scene)
    }

    const onRender = (_scene: Scene): void => {
        if (boxRef.current && boxRef.current.rotation) {
            // Rotate the box on the y-axis
            const deltaTimeInMillis = _scene.getEngine().getDeltaTime()
            /** Rotations per minute */
            const rpm = 10
            boxRef.current.rotation.y +=
                (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
        }
    }

    useEffect(() => {
        if (scene && cameraRef.current) {
            console.log('Scene and camera are ready:', scene, cameraRef.current)
        }
    }, [scene])

    return (
        <SceneComponent
            antialias
            onSceneReady={onSceneReady}
            onRender={onRender}
            id="my-canvas">
            {children}
        </SceneComponent>
    )
}

export default BabylonSceneWrapper
