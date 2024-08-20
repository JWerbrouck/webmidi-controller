// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#6c757d',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#007bff',
        },
        thumb: {
          height: 24,
          width: 24,
          backgroundColor: '#007bff',
        },
      },
    },
  },
});

export default theme;
