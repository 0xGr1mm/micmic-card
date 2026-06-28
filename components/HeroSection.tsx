"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";

const SPOTLIGHT_R = 280;

// Seismic tectonic image — dramatic cracked earth / dark geological
const BG_BASE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=85&auto=format&fit=crop";
const BG_REVEAL = "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=1920&q=85&auto=format&fit=crop";

interface RevealProps { cursorX: number; cursorY: number; }

function RevealLayer({ cursorX, cursorY }: RevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const set = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  // Draw mask every frame cursor changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const div = divRef.current;
    if (!canvas || !div) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
    grad.addColorStop(0,    "rgba(255,255,255,1)");
    grad.addColorStop(0.4,  "rgba(255,255,255,1)");
    grad.addColorStop(0.6,  "rgba(255,255,255,0.75)");
    grad.addColorStop(0.75, "rgba(255,255,255,0.4)");
    grad.addColorStop(0.88, "rgba(255,255,255,0.12)");
    grad.addColorStop(1,    "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const dataUrl = canvas.toDataURL();
    div.style.maskImage = `url(${dataUrl})`;
    div.style.webkitMaskImage = `url(${dataUrl})`;
    div.style.maskSize = "100% 100%";
    (div.style as React.CSSProperties & { webkitMaskSize: string }).webkitMaskSize = "100% 100%";
  }, [cursorX, cursorY]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none", position: "absolute", inset: 0 }} />
      <div
        ref={divRef}
        className="hero-reveal-layer"
        style={{ backgroundImage: `url(${BG_REVEAL})` }}
      />
    </>
  );
}

export default function HeroSection() {
  const mouseRef = useRef({ x: -999, y: -999 });
  const smoothRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const [cursor, setCursor] = useState({ x: -999, y: -999 });

  const onMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const loop = () => {
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;
      setCursor({ x: smoothRef.current.x, y: smoothRef.current.y });
      rafRef.current = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, [onMove]);

  return (
    <section className="hero-section">
      {/* Base image */}
      <div
        className="hero-base-img hero-zoom"
        style={{ backgroundImage: `url(${BG_BASE})` }}
      />

      {/* Dark overlay */}
      <div className="hero-overlay" />

      {/* Cursor reveal layer */}
      <RevealLayer cursorX={cursor.x} cursorY={cursor.y} />

      {/* Heading */}
      <div className="hero-content flex flex-col items-center justify-start" style={{ paddingTop: "15%" }}>
        <h1 className="hero-h1 hero-anim">
          <span
            className="block font-playfair italic font-normal hero-anim hero-reveal"
            style={{ animationDelay: "0.25s" }}
          >
            Your Magnitude.
          </span>
          <span
            className="block font-bold hero-anim hero-reveal line2"
            style={{ animationDelay: "0.42s", letterSpacing: "-0.08em" }}
          >
            Your Card.
          </span>
        </h1>

        {/* Scroll hint */}
        <div
          className="hero-anim hero-fade"
          style={{ animationDelay: "0.9s", marginTop: "36px" }}
        >
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
            color: "rgba(255,255,255,0.45)",
            fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "0.2em",
          }}>
            <span>SCROLL TO BUILD</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
              <rect x="5" y="1" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="8" cy="5" r="1.5" fill="currentColor" className="anim-pulse" />
              <path d="M8 16 L8 22 M5 19 L8 22 L11 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom left: tagline */}
      <div
        className="hero-anim hero-fade"
        style={{
          animationDelay: "0.7s",
          position: "absolute", bottom: "56px", left: "40px",
          maxWidth: "260px", zIndex: 50, display: "none",
        }}
      >
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
          Every seismic tier records an impact — from first tremors to legendary faults, layered across the Seismic testnet.
        </p>
      </div>

      {/* Bottom right: CTA */}
      <div
        className="hero-anim hero-fade"
        style={{
          animationDelay: "0.85s",
          position: "absolute", bottom: "40px", right: "40px",
          maxWidth: "260px", zIndex: 50,
          display: "flex", flexDirection: "column", gap: "16px",
        }}
      >
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
          Upload your PFP, pick your Magnitude tier, and get a card that proves you felt the fault.
        </p>
        <button
          className="btn-primary"
          style={{
            padding: "12px 28px", borderRadius: "100px",
            fontSize: "14px", fontFamily: "Inter, sans-serif",
            alignSelf: "flex-start",
          }}
          onClick={() => document.getElementById("build-section")?.scrollIntoView({ behavior: "smooth" })}
        >
          Build My Card ↓
        </button>
      </div>

      {/* Move spotlight hint */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        zIndex: 45, pointerEvents: "none",
        color: "rgba(255,255,255,0.18)",
        fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.15em",
        textAlign: "center",
        opacity: cursor.x > 0 ? 0 : 1, transition: "opacity 1s ease",
      }}>
        MOVE CURSOR TO REVEAL
      </div>
    </section>
  );
}
