import { createTheme, ThemeOptions } from '@mui/material/styles'

export const themeOptions: ThemeOptions = {
    palette: {
        background: {
            default: '#1a130a',
            paper: '#1a130a',
        },
        divider: '#a6a68b',
        error: {
            main: '#d32f2f',
        },
        mode: 'dark',
        primary: {
            main: '#f7f1b3',
        },
        secondary: {
            main: '#66bb6a',
        },
        text: {
            primary: '#e8e8e8',
        },
    },
    typography: {
        body2: {
            fontSize: '.8rem',
        },
        button: {
            fontFamily: 'Cormorant+Garamond',
            fontSize: '1rem',
        },
        fontFamily: 'Source Sans Pro',
        fontSize: 16,

        h1: {
            fontFamily: 'Cormorant+Garamond',
        },
    },
}

export const theme = createTheme(themeOptions)

export default theme
