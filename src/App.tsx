import { ReactElement, useRef } from 'react'
import SceneGBTScope from './components/SceneGBTScope.tsx'
import SceneRadialOrthographic from './components/SceneRadialOrthographic.tsx'
import SceneRadialSymmetry from './components/SceneRadialSymmetry.tsx'

function App(): ReactElement {
    const divRef = useRef<HTMLDivElement | null>(null)
    return (
        <>
            <h1>Babylon</h1>
            <h2>h2</h2>
            <div ref={divRef}>
                <SceneRadialSymmetry src={'uv-checker.png'} />
                <div style={{ width: '50%' }}>
                    {' '}
                    <SceneRadialOrthographic aspect_ratio={1.8} />
                    <SceneGBTScope
                        segments={4}
                        src={'uv-checker.png'}
                        aspect_ratio={1.8}
                    />
                </div>
            </div>
        </>
    ) as ReactElement
}

export default App
