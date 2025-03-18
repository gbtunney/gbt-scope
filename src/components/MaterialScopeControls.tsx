import { useControls } from 'leva'
import { ReactElement, useRef } from 'react'

import MaterialScope, {
    ControlDefaults,
    MaterialScopeProps,
    ShaderUniforms,
} from './MaterialScope.tsx'

type ControlProps = {
    enabled?: boolean
}
const MaterialScopeControls = ({
    enabled = true,
    ...props
}: ControlProps & Omit<MaterialScopeProps, 'onInit'>): ReactElement => {
    const uniforms = useRef<ShaderUniforms | undefined>(undefined)
    /* eslint sort/object-properties:off */
    const [, set] = useControls(() => ({
        // animate: true,
        segments: {
            value: 1,
            min: 2,
            max: 40,
            step: 1,
            onChange: (v: number): void => {
                if (uniforms.current !== undefined) {
                    uniforms.current.segments.value = v
                }
            },
        },
        rotationScale: {
            value: 1,
            min: 0,
            max: 3,
            step: 0.01,
            onChange: (v: number): void => {
                if (uniforms.current !== undefined) {
                    uniforms.current.uRotationAmount.value = v
                }
            },
        },

        offsetScale: {
            value: 1,
            min: 0,
            max: 3,
            step: 0.01,
            onChange: (v: number): void => {
                if (uniforms.current !== undefined) {
                    uniforms.current.uRotationAmount.value = v
                }
            },
        },
        scaleFactor: {
            value: 1,
            min: 0,
            max: 3,
            step: 0.01,
            onChange: (v: number): void => {
                if (uniforms.current !== undefined) {
                    uniforms.current.uScaleFactor.value = v
                }
            },
        },
        opacity: {
            value: 1,
            min: 0,
            max: 1,
            step: 0.01,
            onChange: (v: number): void => {
                if (uniforms.current !== undefined) {
                    uniforms.current.uOpacity.value = v
                }
            },
        },
        rotation_speed: {
            value: 0,
            min: 0,
            max: 0.5,
            step: 0.001,
            /*onChange: (v: number) => {
                if (uniforms.current !== undefined ) {
                    uniforms.current.uOpacity.value = v
                }
            },*/
        } /*
         rotation: {
             value: UNIFORM_DEFAULTS.rotation,
             ...control_defaults,
             onChange: (v) => {
                 const uniforms:ShaderUniforms|undefined = getUniforms()
                 if (uniforms !== undefined
                     && frame_animate === false ) {
                     uniforms.uRotation.value = v
                 }
             },
         },
         offset: {
             value: UNIFORM_DEFAULTS.offset,
             ...control_defaults,
             onChange: (v: Point) => {
                 const uniforms:ShaderUniforms|undefined = getUniforms()
                 if (uniforms !== undefined ) {
                     uniforms.uOffset.value = new Vector2(
                         v.x,
                         v.y,
                     )
                 }
             },
         },*/,
    }))
    const handleCallback = (
        value: ShaderUniforms,
        _defaults: ControlDefaults,
    ): void => {
        if (uniforms.current === undefined) {
            uniforms.current = value
            set(_defaults)
            console.log('Callback value:', value, uniforms.current, _defaults)
        }
    }
    return (
        <>
            <MaterialScope onInit={handleCallback} {...props} />
        </>
    )
}

export default MaterialScopeControls
