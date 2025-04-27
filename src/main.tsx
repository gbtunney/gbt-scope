import CssBaseline from '@mui/material/CssBaseline'
import { Fragment, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'

export default {}
const element = document.getElementById('root')

if (element !== null) {
    createRoot(element).render(
        <StrictMode>
            <Fragment>
                <CssBaseline />
                <App />
            </Fragment>
        </StrictMode>,
    )
}
