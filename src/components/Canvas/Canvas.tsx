import { Box, Button, styled } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ACTUAL_CANVAS_SIZE, CANVAS_SIZE } from "../ModelTF/constants";

const StyledBox = styled(Box)`
  margin: 50px auto 10px;
  width: ${ACTUAL_CANVAS_SIZE}px;
`;

const CanvasStyle = {
  width: ACTUAL_CANVAS_SIZE + "px",
  backgroundColor: "#000",
  cursor: "crosshair",
};

export type CtxType = CanvasRenderingContext2D | undefined;

type CanvasProps = {
  onChange: (canvas: HTMLCanvasElement | null) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
};

export function Canvas({ onChange, onKeyDown }: CanvasProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CtxType>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });

    if (!ctx) return;

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    setCtx(ctx);

    return () => {
      ctx?.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    };
  }, []);

  const clearHandler = () => {
    ctx?.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  };

  const startDrawing = () => {
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (!ctx || !isDrawing || !canvas) return;

    const x =
      ((e.clientX - canvas.offsetLeft) * CANVAS_SIZE) / ACTUAL_CANVAS_SIZE;
    const y =
      ((e.clientY - canvas.offsetTop) * CANVAS_SIZE) / ACTUAL_CANVAS_SIZE;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    onChange(canvasRef.current);
  };

  return (
    <StyledBox>
      <canvas
        ref={canvasRef}
        style={CanvasStyle}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        tabIndex={1}
        onKeyDown={onKeyDown}
      />
      <Button variant="contained" onClick={clearHandler}>
        CLEAR
      </Button>
    </StyledBox>
  );
}
