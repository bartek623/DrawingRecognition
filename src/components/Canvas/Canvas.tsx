import { Box, styled } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const ACTUAL_CANVAS_SIZE = 500;

const StyledBox = styled(Box)`
  margin: 50px auto;
  width: ${ACTUAL_CANVAS_SIZE}px;
`;

const CanvasStyle = {
  width: ACTUAL_CANVAS_SIZE + "px",
  backgroundColor: "#fff",
};

export type CtxType = CanvasRenderingContext2D | undefined;

type CanvasProps = {
  width: number;
  height: number;
  onChange: (ctx: CtxType) => void;
};

export function Canvas({ width, height, onChange }: CanvasProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CtxType>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });

    if (!ctx) return;

    setCtx(ctx);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 0.2;
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = () => {
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (!ctx || !isDrawing || !canvas) return;
    console.log(e);

    const x = ((e.clientX - canvas.offsetLeft) * width) / ACTUAL_CANVAS_SIZE;
    const y = ((e.clientY - canvas.offsetTop) * height) / ACTUAL_CANVAS_SIZE;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    onChange(ctx);
  };

  return (
    <StyledBox>
      <canvas
        ref={canvasRef}
        style={CanvasStyle}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onChange={() => onChange(ctx)}
      />
    </StyledBox>
  );
}
