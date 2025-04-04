import { ReactElement, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BabylonSceneWrapper from './components/BabylonSceneWrapper.tsx'
/** Import Kaleidoscope from './components/Kaleidoscope.tsx' */
function App(): ReactElement {
    const [count, setCount] = useState(0)
    const divRef = useRef<HTMLDivElement | null>(null)
    const buttonClick = (value: number): void => {
        console.log('Callback value:', value)
    }

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div
                ref={divRef}
                style={{ margin: '0 auto', maxWidth: '60%', width: 'auto' }}
                className="card">
                <BabylonSceneWrapper>
                    <h2>Babylon!!</h2>
                </BabylonSceneWrapper>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    ) as ReactElement
}

export default App
