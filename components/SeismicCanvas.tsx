"use client";
import { useEffect, useRef } from "react";

interface Line {
  y: number;
  points: number[];
  speed: number;
  amp: number;
  color: string;
  alpha: number;
  phase: number;
}

const COLORS = ["#9B6B80", "#c4a0ab", "#6b3f52", "#3D2831"];

export default function SeismicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const linesRef = useRef<Line[]>([]);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initLines();
    };

    const initLines = () => {
      const count = Math.floor(canvas.height / 80);
      linesRef.current = Array.from({ length: count }, (_, i) => ({
        y: (canvas.height / count) * i + 40,
        points: new Array(Math.ceil(canvas.width / 4) + 1).fill(0),
        speed: 0.4 + Math.random() * 0.6,
        amp: 4 + Math.random() * 28,
        color: COLORS[i % COLORS.length],
        alpha: 0.08 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      tRef.current += 0.008;
      const t = tRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const line of linesRef.current) {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.globalAlpha = line.alpha;
        ctx.lineWidth = 1;

        const step = 4;
        for (let x = 0; x <= canvas.width; x += step) {
          const nx = x / canvas.width;
          // quiet at edges, active in center-ish
          const envelope = Math.pow(Math.sin(nx * Math.PI), 0.6);
          // seismic: combination of frequencies
          const wave =
            Math.sin(nx * 18 * line.speed + t * 2.5 + line.phase) * 0.5 +
            Math.sin(nx * 7  * line.speed + t * 1.2 + line.phase * 1.3) * 0.3 +
            Math.sin(nx * 42 * line.speed + t * 4.0 + line.phase * 0.7) * 0.2;

          const y = line.y + wave * line.amp * envelope;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Vertical crack lines — slow drift
      ctx.globalAlpha = 0.04;
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "#c4a0ab";
      const crackCount = 5;
      for (let i = 0; i < crackCount; i++) {
        const x = (canvas.width / crackCount) * i + Math.sin(t * 0.3 + i) * 20;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        // jagged crack
        let cy = 0;
        while (cy < canvas.height) {
          cy += 40 + Math.random() * 60;
          const cx = x + (Math.random() - 0.5) * 30;
          ctx.lineTo(cx, cy);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="seismic-canvas"
      aria-hidden="true"
    />
  );
}
