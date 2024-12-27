import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material'
import App from './App.tsx'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
  palette: {
    primary: {
      main: "#A91D3A",
    },
    secondary: {
      main: "#C73659"
    },
    info: {
      main: "#e57373"
    },
    background: {
      default: "#151515",
      paper: "#222222"
    }
  },
  typography: {
    allVariants: {
      color: "#e3f2fd"
    }
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          color: "#e3f2fd",
        },
        icon: {
          color: "#e3f2fd",
        },
      },
    },
  },
  shape: {
    borderRadius: 6
  }
})
// using this color palette: https://colorhunt.co/palette/151515a91d3ac73659eeeeee
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
