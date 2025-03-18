import { useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { ReactElement, useEffect, useMemo, useRef } from 'react'
import { IUniform, ShaderMaterial, Texture, Vector2, Vector4 } from 'three'
import { getResolution, XY } from '../helpers.js'

export type ShaderUniforms = {
    uTexture: IUniform<Texture>
    resolution: IUniform<Vector4>

    uOffset: IUniform<Vector2>
    uRotation: IUniform<number>

    segments: IUniform<number>
    uScaleFactor: IUniform<number>
    uRotationAmount: IUniform<number>
    uOffsetAmount: IUniform<number>
    uImageAspect: IUniform<number>
    uOpacity: IUniform<number>
}

export type MaterialScopeProps = {
    /** Texture url */
    src: string
    segments?: ShaderUniforms['segments']['value'] /** Int */
    scaleFactor?: ShaderUniforms['uScaleFactor']['value'] /** [-1,1] mapped to [0,2]? */
    rotationScale?: ShaderUniforms['uRotationAmount']['value']
    offsetScale?: ShaderUniforms['uOffsetAmount']['value'] /** [-1,1] mapped to [0,2] */
    rotation?: ShaderUniforms['uRotation']['value']
    offset?: XY
    image_aspect?: number
    opacity?: ShaderUniforms['uOpacity']['value']
    /** TODO */
    blendMode?: string

    speed_interval?: number /** Steady speed */
    rotation_speed?: number /** Multiplier | 0 is oFF [-1,1] map 0,1 */
    offset_speed?: number /** Multiplier [-1,1] map 0,1 */
    mouse_curve?: [number, number] /** Remap range for variance */
    mouse_multiplier?: number

    children?: ReactElement
    onCallback?: (value: number) => void
}
const MaterialScope = ({
    blendMode = 'normal',
    children,
    image_aspect = undefined,
    mouse_curve = [0, 1],
    mouse_multiplier = 1,
    offset = [0, 0],
    offset_speed = 0,
    offsetScale = 1,
    onCallback,
    opacity = 1,
    rotation = 0,
    rotation_speed = 0,
    rotationScale = 1,
    scaleFactor = 1,
    segments = 6,
    //todo
    speed_interval = 0.2,
    src,
}: MaterialScopeProps): ReactElement => {
    const { pointer, viewport } = useThree()

    const shaderMaterialRef = useRef<ShaderMaterial | null>(null)
    const _texture: Texture = useTexture(src)

    const [offsetX, offsetY] = offset
    const uniforms: ShaderUniforms = useMemo(() => {
        return {
            resolution: {
                value: getResolution({
                    height: viewport.height,
                    width: viewport.width,
                }),
            },
            segments: { value: segments },
            uImageAspect: { value: image_aspect !== undefined ? 1 : 1 },
            uOffset: { value: new Vector2(offsetX, offsetY) },
            uOffsetAmount: { value: offsetScale },
            uOpacity: { value: opacity },
            uRotation: { value: rotation },
            uRotationAmount: { value: rotationScale },
            uScaleFactor: { value: scaleFactor },
            uTexture: { value: _texture }, // TODO: fix imageDimensions.width / imageDimensions.height,
        }
    }, [
        viewport,
        segments,
        image_aspect,
        offsetX,
        offsetY,
        offsetScale,
        rotationScale,
        rotation,
        scaleFactor,
        _texture,
    ])

    useEffect(() => {
        return (): void => {}
    }, [])

    return (
        <>
            <div>{children}</div>
        </>
    )
}

export const vertex = `
varying vec2 vUv;
void main() {
vUv = uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`

export const fragment = `
precision mediump float; // Shader Precision
uniform sampler2D uTexture;
uniform vec4 resolution;
uniform float uOpacity;
varying vec2 vUv;
const float PI = 3.14159265359;
uniform float segments; // Number of segments
uniform vec2 uOffset;
uniform float uRotation;
uniform float uOffsetAmount;
uniform float uRotationAmount;
uniform float uScaleFactor;
uniform float uImageAspect; // Uniform for image aspect ratio

vec2 adjustUV(vec2 uv, vec2 offset, float rotation) {
vec2 uvOffset = uv + offset * uOffsetAmount;
float cosRot = cos(rotation * uRotationAmount);
float sinRot = sin(rotation * uRotationAmount);
mat2 rotMat = mat2(cosRot, -sinRot, sinRot, cosRot);
return rotMat * (uvOffset - vec2(0.5)) + vec2(0.5);
}

void main() {
vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
vec2 uv = newUV * 2.0 - 1.0;
float angle = atan(uv.y, uv.x);
float radius = length(uv);
float segment = PI * 2.0 / segments;
angle = mod(angle, segment);
angle = segment - abs(segment / 2.0 - angle);
uv = radius * vec2(cos(angle), sin(angle));
float scale = 1.0 / uScaleFactor;
vec2 adjustedUV = adjustUV(uv * scale + scale, uOffset, uRotation);
vec2 aspectCorrectedUV = vec2(adjustedUV.x, adjustedUV.y * uImageAspect);
vec2 tileIndex = floor(aspectCorrectedUV);
vec2 oddTile = mod(tileIndex, 2.0);
vec2 mirroredUV = mix(fract(aspectCorrectedUV), 1.0 - fract(aspectCorrectedUV), oddTile);
vec4 color = texture2D(uTexture, mirroredUV);
color.a *= uOpacity;
gl_FragColor = color;
}
`

export default MaterialScope
