import { CssBaseline, ThemeProvider } from "@mui/material";

import theme from "./theme/theme";
import { ModelTF } from "./components";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ModelTF />
    </ThemeProvider>
  );
}

export default App;
