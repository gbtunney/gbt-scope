import {
    Color3,
    IShaderMaterialOptions,
    Scene,
    ShaderMaterial,
} from '@babylonjs/core'
import { RGBColor } from '../helpers.js'

export default {}
export const getColorShaderMaterial = (
    _scene: Scene,
    _options: Partial<IShaderMaterialOptions> = {},
    _color: RGBColor = [1, 0, 0],
): ShaderMaterial => {
    const vertex = `precision highp float;
        attribute vec3 position;
        uniform mat4 worldViewProjection;

        void main() {
           vec4 p = vec4(position, 1.);
            gl_Position = worldViewProjection * p;
        }`
    const fragment = `
        precision highp float;
        uniform vec3 color;
        void main() {
            gl_FragColor = vec4(color, 1.);
        }`
    return new ShaderMaterial(
        'custom',
        _scene,
        { fragmentSource: fragment, vertexSource: vertex },
        _options,
    ).setColor3('color', new Color3(..._color))
}
