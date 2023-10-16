import { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";

import { CANVAS_SIZE } from "../ModelTF/constants";

const CanvasStyle = {
  width: CANVAS_SIZE + "px",
  backgroundColor: "#000",
  cursor: "crosshair",
};

type CanvasTestProps = {
  tensor: tf.Tensor | undefined;
};

export function CanvasTest({ tensor }: CanvasTestProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (async () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (!canvas || !tensor) return;

      const data = await tf.browser.toPixels(
        tensor.as2D(CANVAS_SIZE, CANVAS_SIZE),
        canvas
      );

      const imgData = new ImageData(data, CANVAS_SIZE, CANVAS_SIZE);

      ctx?.putImageData(imgData, 0, 0);
    })();
  }, [tensor]);

  return (
    <canvas
      ref={canvasRef}
      style={CanvasStyle}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
    />
  );
}
