import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import { ReactElement, useRef } from 'react'
//import './App.css'
import SceneRadialSymmetry from './components/SceneRadialSymmetry.tsx'
/** Import Kaleidoscope from './components/Kaleidoscope.tsx' */

export const themeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#f7f1b3',
        },
        secondary: {
            main: '#66bb6a',
        },
        background: {
            default: '#1a130a',
            paper: '#1a130a',
        },
        text: {
            primary: '#e8e8e8',
        },
        error: {
            main: '#d32f2f',
        },
        divider: '#a6a68b',
    },
    typography: {
        button: {
            fontFamily: 'Cormorant+Garamond',
            fontSize: '1rem',
        },
        fontSize: 16,
        fontFamily: 'Source Sans Pro',
        h1: {
            fontFamily: 'Cormorant+Garamond',
        },

        body2: {
            fontSize: '.8rem',
        },
    },
}
const theme = createTheme(themeOptions)
function App(): ReactElement {
    const divRef = useRef<HTMLDivElement | null>(null)
    return (
        <>
            <ThemeProvider theme={theme}>
                <h1>Babylon</h1>
                <h2>h2</h2>
                <div ref={divRef}>
                    <SceneRadialSymmetry />
                </div>
            </ThemeProvider>
        </>
    ) as ReactElement
}

export default App
