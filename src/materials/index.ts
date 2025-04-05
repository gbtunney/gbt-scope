import {
    Color3,
    IShaderMaterialOptions,
    Scene,
    ShaderMaterial,
    Texture,
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

export const getTextureShaderMaterial = (
    _scene: Scene,
    _src: string = 'path/to/your/image.png',
): ShaderMaterial => {
    const vertex = `
        precision highp float;

        // Attributes
        attribute vec3 position;
        attribute vec2 uv;

        // Uniforms
        uniform mat4 worldViewProjection;

        // Varying
        varying vec2 vUV;

        void main(void) {
            gl_Position = worldViewProjection * vec4(position, 1.0);
            vUV = uv;
        }
    `
    const fragment = `
        precision highp float;

        // Varying
        varying vec2 vUV;

        // Uniforms
        uniform sampler2D textureSampler;

        void main(void) {
            gl_FragColor = texture2D(textureSampler, vUV);
        }
    `

    // Create the ShaderMaterial
    const shaderMaterial = new ShaderMaterial(
        'textureShader',
        _scene,
        {
            fragmentSource: fragment,
            vertexSource: vertex,
        },
        {
            attributes: ['position', 'uv'],
            uniforms: ['worldViewProjection', 'textureSampler'],
        },
    )

    // Load the texture
    shaderMaterial.setTexture(
        'textureSampler',
        new Texture(_src, _scene, true, false),
    )

    // Disable back-face culling to ensure the texture is visible from all sides
    shaderMaterial.backFaceCulling = false

    return shaderMaterial
}
