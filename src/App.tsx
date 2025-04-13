import { ReactElement, useRef } from 'react'
import './App.css'
import SceneRadialSymmetry from './components/SceneRadialSymmetry.tsx'
/** Import Kaleidoscope from './components/Kaleidoscope.tsx' */
function App(): ReactElement {
    const divRef = useRef<HTMLDivElement | null>(null)
    return (
        <>
            <h1>Babylon</h1>
            <div ref={divRef} className="card">
                <SceneRadialSymmetry />
            </div>
        </>
    ) as ReactElement
}

export default App
