"use client";
import { useEffect, useRef } from "react";

export default function SeismicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Line = { y: number; speed: number; amp: number; color: string; alpha: number; phase: number };
    let lines: Line[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.floor(canvas.height / 90);
      lines = Array.from({ length: count }, (_, i) => ({
        y: (canvas.height / count) * i + 45,
        speed: 0.35 + Math.random() * 0.5,
        amp: 3 + Math.random() * 22,
        color: ["#9B6B80","#c4a0ab","#5a2d6a","#2d1535"][i % 4],
        alpha: 0.06 + Math.random() * 0.14,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      tRef.current += 0.007;
      const t = tRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const line of lines) {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.globalAlpha = line.alpha;
        ctx.lineWidth = 0.8;
        for (let x = 0; x <= canvas.width; x += 3) {
          const nx = x / canvas.width;
          const env = Math.pow(Math.sin(nx * Math.PI), 0.5);
          const wave =
            Math.sin(nx * 16 * line.speed + t * 2.2 + line.phase) * 0.5 +
            Math.sin(nx * 6  * line.speed + t * 1.0 + line.phase * 1.3) * 0.3 +
            Math.sin(nx * 38 * line.speed + t * 3.5 + line.phase * 0.7) * 0.2;
          const y = line.y + wave * line.amp * env;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    rafRef.current = requestAnimationFrame(draw);
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(rafRef.current); };
  }, []);

  return <canvas ref={canvasRef} id="seismic-canvas" aria-hidden="true" />;
}
