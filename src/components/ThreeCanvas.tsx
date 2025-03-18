import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { CSSProperties, ReactElement } from 'react'

import MaterialScopeControls from './MaterialScopeControls.tsx'

type ThreeCanvasProps = {
    aspect_ratio?: number | 'parent'
    color?: string
    orbit?: boolean
    cube?: boolean
    children?: ReactElement
}
const ThreeCanvas = ({
    aspect_ratio = 1,
    children,

    color = 'inherit',
    cube = false,
    orbit = true,
}: ThreeCanvasProps): ReactElement => {
    const customStyle: CSSProperties = {
        background: 'purple',
        border: '2px solid green',

        ...(aspect_ratio !== 'parent' ? { aspectRatio: aspect_ratio } : {}),
    }

    const frustumSize = 1

    return (
        <>
            <Canvas style={customStyle}>
                <OrthographicCamera
                    left={frustumSize / -2}
                    right={frustumSize / 2}
                    top={frustumSize / 2}
                    bottom={frustumSize / -2}
                    near={-1000}
                    far={1000}
                    position={[0, 0, 1]}
                    makeDefault
                />
                <mesh scale={[1, 1, 1]}>
                    {cube ? <boxGeometry /> : <planeGeometry />}
                    <MaterialScopeControls segments={5} src="eel.jpg" />
                </mesh>
                {children}
                <OrbitControls enabled={orbit} />
            </Canvas>
        </>
    )
}

export default ThreeCanvas
