import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme/theme";
import { Canvas, CtxType } from "./components/Canvas/Canvas";

const CANVAS_SIZE = 48;

function App() {
  const canvasChangeHandler = (ctx: CtxType) => {
    const imageData = ctx?.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (!imageData) return;

    const data32bits = new Uint32Array(imageData?.data.buffer);
    const simpleData = data32bits.map((el) => el && 1);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Canvas
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onChange={canvasChangeHandler}
      />
    </ThemeProvider>
  );
}

export default App;
