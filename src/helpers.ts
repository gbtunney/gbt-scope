import { Color3, Vector3, Vector4 } from '@babylonjs/core'

export default {}
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
export type TVector3 = ConstructorParameters<typeof Vector3>
