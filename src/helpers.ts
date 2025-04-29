import {
    ArcRotateCamera,
    Camera,
    Color3,
    FreeCamera,
    Scene,
    Vector2,
    Vector3,
    Vector4,
} from '@babylonjs/core'

export type Dimensions = {
    width: number
    height: number
}
export type Point = { x: number; y: number }
export type XY = [number, number]
export const getResolution = (dimensions: Dimensions): Vector4 => {
    const { height: _height, width: _width } = dimensions
    const aA = _height / _width > 1 ? _width / _height : 1
    const aB = _height / _width > 1 ? 1 : _height / _width
    return new Vector4(_width, _height, aA, aB)
}
export const distanceBetweenPoints = (a: Point, b: Point): number =>
    Math.hypot(b.x - a.x, b.y - a.y)

export type RGBColor = ConstructorParameters<typeof Color3>
export type Vector3Params = ConstructorParameters<typeof Vector3>
export type Vector2Params = ConstructorParameters<typeof Vector2>
export type Vector4Params = ConstructorParameters<typeof Vector4>
const { x, y, z } = Vector3.Zero()

export type CameraConfigPosition = Partial<{
    hRotation: number /** Alpha Math.PI / 2, // Alpha (horizontal rotation) */
    vRotation: number /** Beta Math.PI / 4, // Beta (vertical rotation) */
    radius: number
    position: Vector3Params
    target: Vector3Params
    /** Slow down the zoom speed */
    mouseWheelSpeed: number
    enabled: boolean
}>
export type CameraOrthoConfig = { ortho: true } & Pick<
    CameraConfigPosition,
    'target' | 'enabled'
>
export const setOrthoCamera = (
    scene: Scene,
    camera: FreeCamera,
    { enabled = true, ortho = true, target = [0, 0, 0] }: CameraOrthoConfig,
): FreeCamera => {
    camera.setTarget(new Vector3(...target))
    if (ortho) camera.mode = Camera.ORTHOGRAPHIC_CAMERA

    if (enabled) {
        camera.attachControl(scene.getEngine().getRenderingCanvas(), true)
    } else {
        camera.detachControl()
    }
    return camera
}
export const setRotateCameraPosition = (
    camera: ArcRotateCamera,
    scene: Scene,
    {
        enabled = true,
        hRotation = 0,
        mouseWheelSpeed = 0.01,
        position = [x, y, z],
        radius = 10,
        target = [0, 0, 0],
        vRotation = 0,
    }: CameraConfigPosition,
): void => {
    camera.alpha = hRotation
    camera.beta = vRotation
    camera.radius = radius
    camera.wheelDeltaPercentage = mouseWheelSpeed
    //TODO: Fix this scamera.setPosition(new Vector3(...position))
    camera.setTarget(new Vector3(...target))
    if (enabled) {
        camera.attachControl(scene.getEngine().getRenderingCanvas(), true)
    } else {
        camera.detachControl()
    }
}
export default {}
