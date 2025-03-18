import { ReactElement, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ThreeCanvas from './components/ThreeCanvas.tsx'
function App(): ReactElement {
    const [count, setCount] = useState(0)
    // const helloRef = useRef<ReactElement<typeof HelloWorld> | null>(null)
    const divRef = useRef<HTMLDivElement | null>(null)
    const handleCallback = (value: number): void => {
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
                <ThreeCanvas />
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
