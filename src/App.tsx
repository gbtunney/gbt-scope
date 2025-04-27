import { ReactElement, useRef } from 'react'
//import './App.css'
import SceneRadialSymmetry from './components/SceneRadialSymmetry.tsx'
/** Import Kaleidoscope from './components/Kaleidoscope.tsx' */

function App(): ReactElement {
    const divRef = useRef<HTMLDivElement | null>(null)
    return (
        <>
            <h1>Babylon</h1>
            <h2>h2</h2>
            <div ref={divRef}>
                <SceneRadialSymmetry />
            </div>
        </>
    ) as ReactElement
}

export default App
