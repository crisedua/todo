import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App';
import './styles/main.css';

// Importar fuentes de Google
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@500;600;700&display=swap';
document.head.appendChild(fontLink);

// Crear tema personalizado con MUI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1489e6', // Color principal azul
      light: '#5cb7ff',
      dark: '#006bb4',
    },
    secondary: {
      main: '#ffbb1a', // Color secundario amarillo
      light: '#ffda80',
      dark: '#e6a200',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },
    h2: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normaliza estilos CSS en todos los navegadores */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
