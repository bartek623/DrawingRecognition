import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme/theme";
import { Canvas, CtxType } from "./components/Canvas/Canvas";

const CANVAS_SIZE = {
  WIDTH: 64,
  HEIGHT: 64,
};

function App() {
  const canvasChangeHandler = (ctx: CtxType) => {
    const imageData = ctx?.getImageData(
      0,
      0,
      CANVAS_SIZE.WIDTH,
      CANVAS_SIZE.HEIGHT
    );

    if (!imageData) return;

    const data32bits = new Uint32Array(imageData?.data.buffer);
    const simpleData = data32bits.map((el) => el && 1);

    console.log(simpleData);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Canvas
        width={CANVAS_SIZE.WIDTH}
        height={CANVAS_SIZE.HEIGHT}
        onChange={canvasChangeHandler}
      />
    </ThemeProvider>
  );
}

export default App;
