import React, { useEffect, useRef, useState } from "react";

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
    const ctx = canvas?.getContext("2d", { colorSpace: "display-p3" });

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
    if (!ctx || !isDrawing) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    onChange(ctx);
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ transform: "scale(10)", backgroundColor: "white" }}
      width={width}
      height={height}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onChange={() => onChange(ctx)}
    />
  );
}
