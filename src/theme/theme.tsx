import { createTheme } from '@mui/material';
import { palette } from './palette';
import { typography } from './typography';

const theme = createTheme({
  palette: palette,
  typography: typography,
  components: {
    MuiInput: {
      styleOverrides: {
        input: {
          ...typography.body1,
        },
      },
    },
  },
});

export default theme;
