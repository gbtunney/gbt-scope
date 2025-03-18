import { useState,useRef ,ReactElement} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HelloWorld from './components/HelloWorld.tsx'
function App() {
  const [count, setCount] = useState(0)
   // const helloRef = useRef<ReactElement<typeof HelloWorld> | null>(null)
    const divRef = useRef<HTMLDivElement| null>(null)
    const handleCallback = (value: number) => {
        console.log('Callback value:', value);
    };
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <span ref={divRef} className="card">
          <HelloWorld  onCallback={handleCallback} testing1={30}><h2 >HEALINE </h2></HelloWorld>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </span>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
