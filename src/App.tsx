import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme/theme";
import { Canvas } from "./components/Canvas/Canvas";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Canvas width={500} height={500} />
    </ThemeProvider>
  );
}

export default App;
