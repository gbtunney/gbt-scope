import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

export default {}
const element = document.getElementById('root')

if (element !== null) {
    createRoot(element).render(
        <StrictMode>
            <App />
        </StrictMode>,
    )
}
