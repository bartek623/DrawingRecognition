import React, { useEffect, useRef, useState } from "react";

type CanvasProps = {
  width: number;
  height: number;
};

type ContextType = CanvasRenderingContext2D | undefined;

export function Canvas({ width, height }: CanvasProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<ContextType>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx) return;

    setCtx(ctx);
    ctx.strokeStyle = "#6b5b95";
    ctx.shadowBlur = 15;
    ctx.lineWidth = 8;
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = () => {
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx || !isDrawing) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
}
